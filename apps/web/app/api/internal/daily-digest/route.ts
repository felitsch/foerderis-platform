import { NextResponse } from "next/server";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Internal webhook — called by the DevOpsEngineer Paperclip agent when the
// "Daily Digest" routine fires (daily at 08:00 Europe/Berlin).
// Protected by INTERNAL_WEBHOOK_SECRET when set.
//
// Workflow:
//  1. Fetch issues completed in the last 24 h (status=done)
//  2. Fetch all currently in_progress issues
//  3. Fetch in_review issues tagged `needs-approval` (awaiting Felix approval)
//  4. Compose an HTML digest email and send via Resend to felix@foerderis.de
// ---------------------------------------------------------------------------

const NEEDS_APPROVAL_LABEL_ID = "d730a759-2ab7-4646-93fb-6650642274f6";
const DIGEST_RECIPIENT = "felix@foerderis.de";

export interface PaperclipIssue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  status: string;
  completedAt: string | null;
  priority: string;
}

export async function fetchIssues(
  apiUrl: string,
  companyId: string,
  token: string,
  params: Record<string, string>,
): Promise<PaperclipIssue[]> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiUrl}/api/companies/${companyId}/issues?${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    throw new Error(`Paperclip query failed: ${res.status} (${query})`);
  }
  return res.json() as Promise<PaperclipIssue[]>;
}

export function buildDigestHtml(
  done: PaperclipIssue[],
  inProgress: PaperclipIssue[],
  needsApproval: PaperclipIssue[],
  baseUrl: string,
): string {
  const issueUrl = (issue: PaperclipIssue) =>
    `${baseUrl}/FRDAA/issues/${issue.identifier}`;

  const issueRow = (issue: PaperclipIssue) =>
    `<li><a href="${issueUrl(issue)}">${issue.identifier}</a> — ${issue.title}</li>`;

  const section = (
    heading: string,
    items: PaperclipIssue[],
    emptyMsg: string,
  ) => `
<h2 style="color:#1a1a1a;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-top:28px;">${heading}</h2>
${items.length > 0 ? `<ul style="line-height:1.8;">${items.map(issueRow).join("")}</ul>` : `<p style="color:#6b7280;font-style:italic;">${emptyMsg}</p>`}`;

  const dateStr = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"/></head>
<body style="font-family:sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#374151;">
  <h1 style="color:#f59e0b;margin-bottom:4px;">Foerderis Tagesübersicht</h1>
  <p style="color:#6b7280;margin-top:0;">${dateStr}</p>
  ${section("✅ Abgeschlossen (letzte 24 h)", done, "Keine Tasks abgeschlossen.")}
  ${section("⚙️ Im Flow", inProgress, "Keine laufenden Tasks.")}
  ${section("🔔 Wartet auf Approval", needsApproval, "Keine offenen Approval-Anfragen.")}
  <hr style="margin-top:32px;border:none;border-top:1px solid #e5e7eb;"/>
  <p style="color:#9ca3af;font-size:0.8em;margin-top:12px;">
    Foerderis Daily Digest · automatisch generiert · <a href="${baseUrl}">Paperclip öffnen</a>
  </p>
</body>
</html>`;
}

export async function POST(request: Request) {
  // Optional bearer-token auth
  const secret = process.env.INTERNAL_WEBHOOK_SECRET;
  if (secret) {
    const auth = request.headers.get("Authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const paperclipApiUrl = process.env.PAPERCLIP_API_URL;
  const paperclipCompanyId = process.env.PAPERCLIP_COMPANY_ID;
  const paperclipSystemToken = process.env.PAPERCLIP_SYSTEM_TOKEN;
  const paperclipUiUrl =
    process.env.PAPERCLIP_UI_URL ?? "https://paperclip.ing";

  if (
    !resendApiKey ||
    !paperclipApiUrl ||
    !paperclipCompanyId ||
    !paperclipSystemToken
  ) {
    return NextResponse.json(
      {
        error: "Missing required env vars",
        missing: [
          !resendApiKey && "RESEND_API_KEY",
          !paperclipApiUrl && "PAPERCLIP_API_URL",
          !paperclipCompanyId && "PAPERCLIP_COMPANY_ID",
          !paperclipSystemToken && "PAPERCLIP_SYSTEM_TOKEN",
        ].filter(Boolean),
      },
      { status: 503 },
    );
  }

  const resend = new Resend(resendApiKey);
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    // Fetch all three datasets in parallel
    const [allDone, inProgress, needsApproval] = await Promise.all([
      fetchIssues(paperclipApiUrl, paperclipCompanyId, paperclipSystemToken, {
        status: "done",
      }),
      fetchIssues(paperclipApiUrl, paperclipCompanyId, paperclipSystemToken, {
        status: "in_progress",
      }),
      fetchIssues(paperclipApiUrl, paperclipCompanyId, paperclipSystemToken, {
        status: "in_review",
        labelId: NEEDS_APPROVAL_LABEL_ID,
      }),
    ]);

    // Keep only issues completed within the last 24 h
    const recentlyDone = allDone.filter(
      (i) => i.completedAt != null && i.completedAt >= cutoff,
    );

    const html = buildDigestHtml(
      recentlyDone,
      inProgress,
      needsApproval,
      paperclipUiUrl,
    );

    const dateLabel = new Date().toLocaleDateString("de-DE");
    await resend.emails.send({
      from: "Foerderis <kontakt@foerderis.de>",
      to: DIGEST_RECIPIENT,
      subject: `[Foerderis] Tagesübersicht ${dateLabel}`,
      html,
    });

    return NextResponse.json({
      sent: true,
      recipient: DIGEST_RECIPIENT,
      stats: {
        done: recentlyDone.length,
        inProgress: inProgress.length,
        needsApproval: needsApproval.length,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
