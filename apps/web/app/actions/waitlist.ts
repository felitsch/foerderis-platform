"use server";

import { waitlistFormSchema } from "@foerderis/shared";
import { Resend } from "resend";

export type WaitlistState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

// ---------------------------------------------------------------------------
// Side-effect helpers — each can fail independently without losing the lead
// ---------------------------------------------------------------------------

async function sendLeadConfirmationEmail(
  resend: Resend,
  email: string,
  companyName: string,
): Promise<void> {
  await resend.emails.send({
    from: "Foerderis <kontakt@foerderis.de>",
    to: email,
    subject: "Danke für Ihr Interesse an Foerderis",
    html: `
<p>Guten Tag,</p>
<p>vielen Dank für Ihre Anfrage. Wir haben Ihre Anmeldung für <strong>${companyName}</strong> erhalten.</p>
<p>Unser Team meldet sich innerhalb von 2 Werktagen bei Ihnen.</p>
<p>Bei Rückfragen erreichen Sie uns jederzeit unter <a href="mailto:kontakt@foerderis.de">kontakt@foerderis.de</a>.</p>
<p>Mit freundlichen Grüßen<br/>Das Foerderis-Team</p>
    `.trim(),
  });
}

async function sendInternalAlertEmail(
  resend: Resend,
  email: string,
  companyName: string,
): Promise<void> {
  const notificationEmail =
    process.env.NOTIFICATION_EMAIL ?? "felix@foerderis.de";
  await resend.emails.send({
    from: "Foerderis System <kontakt@foerderis.de>",
    to: notificationEmail,
    subject: `Neuer Waitlist-Lead: ${companyName}`,
    html: `
<p><strong>Neuer Lead auf der Waitlist</strong></p>
<ul>
  <li><strong>Firma:</strong> ${companyName}</li>
  <li><strong>E-Mail:</strong> ${email}</li>
  <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
</ul>
    `.trim(),
  });
}

async function createPaperclipLeadTask(
  email: string,
  companyName: string,
): Promise<void> {
  const apiUrl = process.env.PAPERCLIP_API_URL;
  const companyId = process.env.PAPERCLIP_COMPANY_ID;
  const ceoAgentId = process.env.PAPERCLIP_CEO_AGENT_ID;
  const systemToken = process.env.PAPERCLIP_SYSTEM_TOKEN;

  if (!apiUrl || !companyId || !ceoAgentId || !systemToken) {
    console.warn(
      "[waitlist] Paperclip env vars not configured — skipping task creation",
    );
    return;
  }

  const body = {
    title: `Lead qualifizieren: ${companyName}`,
    description: [
      "## Lead-Daten",
      "",
      `- **Firma:** ${companyName}`,
      `- **E-Mail:** ${email}`,
      `- **Eingetragen am:** ${new Date().toISOString()}`,
      "",
      "## Aufgabe",
      "",
      "Recherchiere das Unternehmen und entwirf einen passenden Ansatz für die Erstansprache.",
      "Berücksichtige Unternehmensgröße, Branche und mögliche Förderprogramme.",
    ].join("\n"),
    status: "todo",
    priority: "high",
    assigneeAgentId: ceoAgentId,
    companyId,
  };

  const res = await fetch(`${apiUrl}/api/companies/${companyId}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${systemToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(
      `Paperclip API responded ${res.status}: ${await res.text()}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Server action
// ---------------------------------------------------------------------------

export async function submitWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const raw = {
    email: formData.get("email"),
    companyName: formData.get("companyName"),
  };

  const parsed = waitlistFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.errors[0]?.message ?? "Ungültige Eingabe.",
    };
  }

  // 1. Persist lead — must succeed; nothing else matters if it fails.
  try {
    // Dynamic import keeps the module-level DATABASE_URL check out of build time
    const { db, waitlist } = await import("@foerderis/db");
    await db.insert(waitlist).values(parsed.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        status: "error",
        message: "Diese E-Mail-Adresse ist bereits registriert.",
      };
    }
    return {
      status: "error",
      message: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
    };
  }

  const { email, companyName } = parsed.data;

  // 2. Fire side-effects in parallel, independently — lead is never lost.
  const resendApiKey = process.env.RESEND_API_KEY;
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  const [emailConfirmResult, emailAlertResult, paperclipResult] =
    await Promise.allSettled([
      resend
        ? sendLeadConfirmationEmail(resend, email, companyName)
        : Promise.reject(new Error("RESEND_API_KEY not configured")),
      resend
        ? sendInternalAlertEmail(resend, email, companyName)
        : Promise.reject(new Error("RESEND_API_KEY not configured")),
      createPaperclipLeadTask(email, companyName),
    ]);

  if (emailConfirmResult.status === "rejected") {
    console.error(
      "[waitlist] Lead confirmation email failed:",
      emailConfirmResult.reason,
    );
  }
  if (emailAlertResult.status === "rejected") {
    console.error(
      "[waitlist] Internal alert email failed:",
      emailAlertResult.reason,
    );
  }
  if (paperclipResult.status === "rejected") {
    console.error(
      "[waitlist] Paperclip task creation failed:",
      paperclipResult.reason,
    );
  }

  return { status: "success" };
}
