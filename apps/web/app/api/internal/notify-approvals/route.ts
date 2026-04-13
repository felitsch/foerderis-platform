import { NextResponse } from "next/server";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Internal webhook — called by the Paperclip BackendDev agent on a polling
// schedule (every 10 min).  Protected by INTERNAL_WEBHOOK_SECRET.
//
// Workflow:
//  1. Query Paperclip for all issues labelled `needs-approval`
//  2. For each, check if a "approval-notification-sent" marker comment exists
//  3. If not, send email to NOTIFICATION_EMAIL via Resend
//  4. Post marker comment on the Paperclip issue so we don't double-notify
// ---------------------------------------------------------------------------

const NOTIFICATION_MARKER = "<!-- approval-notification-sent -->";
const NEEDS_APPROVAL_LABEL_ID = "d730a759-2ab7-4646-93fb-6650642274f6";

interface PaperclipIssue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  status: string;
}

interface PaperclipComment {
  id: string;
  body: string;
}

async function getIssuesNeedingApproval(
  apiUrl: string,
  companyId: string,
  token: string
): Promise<PaperclipIssue[]> {
  const url = `${apiUrl}/companies/${companyId}/issues?labelId=${NEEDS_APPROVAL_LABEL_ID}&status=todo,in_progress,in_review,blocked`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Paperclip issues query failed: ${res.status}`);
  }
  return res.json() as Promise<PaperclipIssue[]>;
}

async function isAlreadyNotified(apiUrl: string, issueId: string, token: string): Promise<boolean> {
  const res = await fetch(`${apiUrl}/issues/${issueId}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const comments = (await res.json()) as PaperclipComment[];
  return comments.some((c) => c.body.includes(NOTIFICATION_MARKER));
}

async function markAsNotified(
  apiUrl: string,
  issueId: string,
  token: string,
  runId?: string
): Promise<void> {
  await fetch(`${apiUrl}/issues/${issueId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(runId ? { "X-Paperclip-Run-Id": runId } : {}),
    },
    body: JSON.stringify({
      body: `${NOTIFICATION_MARKER}\nApproval-Benachrichtigung an felix@foerderis.de gesendet.`,
    }),
  });
}

function buildEmailHtml(issue: PaperclipIssue): string {
  const issueUrl = `https://paperclip.ing/FRDAA/issues/${issue.identifier}`;

  // Truncate description to 3 sentences
  const rawDesc = issue.description ?? "";
  const sentences = rawDesc
    .replace(/#+\s[^\n]*/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  return `
<p><strong>Approval needed</strong> für Paperclip-Issue <a href="${issueUrl}">${issue.identifier}</a>:</p>
<p style="font-size:1.1em;font-weight:bold;">${issue.title}</p>
${sentences ? `<p>${sentences}</p>` : ""}
<p><a href="${issueUrl}" style="background:#f59e0b;color:#fff;padding:8px 16px;border-radius:4px;text-decoration:none;display:inline-block;">Issue ansehen →</a></p>
<hr/>
<p style="color:#666;font-size:0.85em;">Foerderis Approval-System · <a href="${issueUrl}">${issueUrl}</a></p>
  `.trim();
}

export async function POST(request: Request): Promise<NextResponse> {
  // Authenticate
  const secret = process.env.INTERNAL_WEBHOOK_SECRET;
  if (secret) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const paperclipApiUrl = process.env.PAPERCLIP_API_URL;
  const paperclipCompanyId = process.env.PAPERCLIP_COMPANY_ID;
  const paperclipSystemToken = process.env.PAPERCLIP_SYSTEM_TOKEN;
  const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "felix@foerderis.de";

  if (!paperclipApiUrl || !paperclipCompanyId || !paperclipSystemToken) {
    return NextResponse.json(
      {
        error: "Missing required env vars",
        missing: [
          !paperclipApiUrl && "PAPERCLIP_API_URL",
          !paperclipCompanyId && "PAPERCLIP_COMPANY_ID",
          !paperclipSystemToken && "PAPERCLIP_SYSTEM_TOKEN",
        ].filter(Boolean),
      },
      { status: 503 }
    );
  }

  // RESEND_API_KEY is optional: without it, issues are discovered and marked
  // (idempotency) but the email step is skipped.
  const resend = resendApiKey ? new Resend(resendApiKey) : null;
  const runId = request.headers.get("X-Paperclip-Run-Id") ?? undefined;

  const notified: string[] = [];
  const skipped: string[] = [];
  const errors: { id: string; error: string }[] = [];

  try {
    const issues = await getIssuesNeedingApproval(
      paperclipApiUrl,
      paperclipCompanyId,
      paperclipSystemToken
    );

    await Promise.all(
      issues.map(async (issue) => {
        try {
          const alreadySent = await isAlreadyNotified(
            paperclipApiUrl,
            issue.id,
            paperclipSystemToken
          );
          if (alreadySent) {
            skipped.push(issue.identifier);
            return;
          }

          if (resend) {
            // Send email
            await resend.emails.send({
              from: "Foerderis <kontakt@foerderis.de>",
              to: notificationEmail,
              subject: `[Foerderis] Approval needed: ${issue.title}`,
              html: buildEmailHtml(issue),
            });
          }

          // Mark notified (also when email is skipped, so we don't retry once Resend is configured)
          await markAsNotified(paperclipApiUrl, issue.id, paperclipSystemToken, runId);

          notified.push(issue.identifier);
        } catch (err) {
          errors.push({
            id: issue.identifier,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      })
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    notified,
    skipped,
    errors,
    ...(resend
      ? {}
      : { warning: "RESEND_API_KEY not set — marker comments posted but emails not sent" }),
  });
}
