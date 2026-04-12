import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({ data: { id: "email-id" }, error: null });
  return {
    Resend: vi.fn().mockImplementation(() => ({ emails: { send: mockSend } })),
    __mockSend: mockSend,
  };
});

import { POST } from "../route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MARKER = "<!-- approval-notification-sent -->";

function makeIssue(id: string, identifier: string, title: string) {
  return { id, identifier, title, description: `Beschreibung für ${title}.`, status: "in_review" };
}

function mockFetchSequence(responses: Array<{ ok: boolean; json?: unknown; text?: string }>) {
  let callIdx = 0;
  return vi.fn().mockImplementation(() => {
    const resp = responses[callIdx++] ?? { ok: true, json: [] };
    return Promise.resolve({
      ok: resp.ok,
      status: resp.ok ? 200 : 500,
      json: () => Promise.resolve(resp.json ?? []),
      text: () => Promise.resolve(resp.text ?? ""),
    });
  });
}

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/internal/notify-approvals", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/internal/notify-approvals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test";
    process.env.PAPERCLIP_API_URL = "https://api.example.com";
    process.env.PAPERCLIP_COMPANY_ID = "company-123";
    process.env.PAPERCLIP_SYSTEM_TOKEN = "sys_token";
    process.env.NOTIFICATION_EMAIL = "felix@foerderis.de";
    delete process.env.INTERNAL_WEBHOOK_SECRET;
  });

  it("returns 503 when Paperclip env vars are missing", async () => {
    delete process.env.PAPERCLIP_API_URL;
    global.fetch = vi.fn();

    const res = await POST(makeRequest());
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.missing).toContain("PAPERCLIP_API_URL");
  });

  it("returns 200 with warning when RESEND_API_KEY is missing but still posts markers", async () => {
    delete process.env.RESEND_API_KEY;
    const issue = makeIssue("issue-0", "FRDAA-98", "Test ohne Resend");

    global.fetch = mockFetchSequence([
      { ok: true, json: [issue] }, // GET issues
      { ok: true, json: [] }, // GET comments (none)
      { ok: true, json: { id: "comment" } }, // POST marker comment
    ]);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.notified).toContain("FRDAA-98");
    expect(body.warning).toMatch(/RESEND_API_KEY/);
  });

  it("returns 401 when INTERNAL_WEBHOOK_SECRET is set and request lacks auth", async () => {
    process.env.INTERNAL_WEBHOOK_SECRET = "super-secret";
    global.fetch = vi.fn();

    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("accepts request with correct Bearer token", async () => {
    process.env.INTERNAL_WEBHOOK_SECRET = "super-secret";
    // No issues — just want 200
    global.fetch = mockFetchSequence([{ ok: true, json: [] }]);

    const res = await POST(makeRequest({ Authorization: "Bearer super-secret" }));
    expect(res.status).toBe(200);
  });

  it("notifies issues that have no marker comment", async () => {
    const issue = makeIssue("issue-1", "FRDAA-99", "Vertrag mit Acme");

    global.fetch = mockFetchSequence([
      { ok: true, json: [issue] }, // GET issues
      { ok: true, json: [] }, // GET comments (none)
      { ok: true, json: { id: "comment" } }, // POST marker comment
    ]);

    const { Resend } = await import("resend");
    const sendSpy = new (Resend as any)().emails.send;

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.notified).toContain("FRDAA-99");
    expect(body.skipped).toHaveLength(0);
    expect(sendSpy).toHaveBeenCalledOnce();

    const emailCall = sendSpy.mock.calls[0][0];
    expect(emailCall.subject).toBe("[Foerderis] Approval needed: Vertrag mit Acme");
    expect(emailCall.to).toBe("felix@foerderis.de");
  });

  it("skips issues that already have a marker comment", async () => {
    const issue = makeIssue("issue-2", "FRDAA-100", "Rechnung Nr. 42");

    global.fetch = mockFetchSequence([
      { ok: true, json: [issue] },
      { ok: true, json: [{ id: "c-1", body: `${MARKER}\nAlready sent.` }] },
    ]);

    const { Resend } = await import("resend");
    const sendSpy = new (Resend as any)().emails.send;

    const res = await POST(makeRequest());
    const body = await res.json();

    expect(body.skipped).toContain("FRDAA-100");
    expect(body.notified).toHaveLength(0);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it("records error per-issue without failing the whole batch", async () => {
    const issue = makeIssue("issue-3", "FRDAA-101", "Neuer Agent einstellen");

    global.fetch = mockFetchSequence([
      { ok: true, json: [issue] },
      { ok: true, json: [] }, // no marker comment
    ]);

    const { Resend } = await import("resend");
    new (Resend as any)().emails.send.mockRejectedValueOnce(new Error("Rate limit"));

    const res = await POST(makeRequest());
    const body = await res.json();

    expect(body.errors[0].id).toBe("FRDAA-101");
    expect(body.errors[0].error).toContain("Rate limit");
    expect(body.notified).toHaveLength(0);
  });

  it("handles multiple issues — notifies some, skips others", async () => {
    const issue1 = makeIssue("i-1", "FRDAA-201", "Vertragsabschluss Alpha");
    const issue2 = makeIssue("i-2", "FRDAA-202", "Rechnung Beta");

    global.fetch = mockFetchSequence([
      { ok: true, json: [issue1, issue2] },
      { ok: true, json: [] }, // i-1 no marker
      { ok: true, json: [{ id: "c", body: MARKER }] }, // i-2 already marked
      { ok: true, json: { id: "new-comment" } }, // i-1 marker post
    ]);

    const res = await POST(makeRequest());
    const body = await res.json();

    expect(body.notified).toContain("FRDAA-201");
    expect(body.skipped).toContain("FRDAA-202");
  });

  it("includes link to Paperclip issue in email HTML", async () => {
    const issue = makeIssue("issue-5", "FRDAA-303", "DSGVO-Entscheidung");

    global.fetch = mockFetchSequence([
      { ok: true, json: [issue] },
      { ok: true, json: [] },
      { ok: true, json: {} },
    ]);

    const { Resend } = await import("resend");
    const sendSpy = new (Resend as any)().emails.send;

    await POST(makeRequest());

    const html = sendSpy.mock.calls[0][0].html as string;
    expect(html).toContain("FRDAA-303");
    expect(html).toContain("paperclip.ing");
    expect(html).toContain("Approval needed");
  });
});
