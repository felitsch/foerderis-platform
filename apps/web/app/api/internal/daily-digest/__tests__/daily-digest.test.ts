import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — hoisted before module imports
// ---------------------------------------------------------------------------

vi.mock("resend", () => {
  const mockSend = vi
    .fn()
    .mockResolvedValue({ data: { id: "email-id" }, error: null });
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
    })),
    __mockSend: mockSend,
  };
});

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import * as resendModule from "resend";
import {
  buildDigestHtml,
  fetchIssues,
  type PaperclipIssue,
} from "../route.js";
import { POST } from "../route.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockSend = (resendModule as unknown as { __mockSend: ReturnType<typeof vi.fn> })
  .__mockSend;

function makeIssue(overrides: Partial<PaperclipIssue> = {}): PaperclipIssue {
  return {
    id: "issue-id",
    identifier: "FRDAA-99",
    title: "Test Issue",
    description: "A test issue description.",
    status: "done",
    completedAt: new Date().toISOString(),
    priority: "medium",
    ...overrides,
  };
}

function makeRequest(body = {}, secret?: string): Request {
  return new Request("http://localhost/api/internal/daily-digest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

const baseEnv = {
  RESEND_API_KEY: "re_test",
  PAPERCLIP_API_URL: "http://paperclip.test",
  PAPERCLIP_COMPANY_ID: "company-id",
  PAPERCLIP_SYSTEM_TOKEN: "system-token",
  PAPERCLIP_UI_URL: "https://app.foerderis.de",
};

// ---------------------------------------------------------------------------
// Unit: buildDigestHtml
// ---------------------------------------------------------------------------

describe("buildDigestHtml", () => {
  const base = "https://app.foerderis.de";

  it("includes all three sections", () => {
    const done = [makeIssue({ identifier: "FRDAA-1", title: "Done one" })];
    const inProgress = [
      makeIssue({ identifier: "FRDAA-2", title: "In progress", status: "in_progress", completedAt: null }),
    ];
    const approval = [
      makeIssue({ identifier: "FRDAA-3", title: "Needs review", status: "in_review", completedAt: null }),
    ];

    const html = buildDigestHtml(done, inProgress, approval, base);
    expect(html).toContain("FRDAA-1");
    expect(html).toContain("FRDAA-2");
    expect(html).toContain("FRDAA-3");
    expect(html).toContain("Abgeschlossen");
    expect(html).toContain("Im Flow");
    expect(html).toContain("Wartet auf Approval");
  });

  it("shows empty-state messages when lists are empty", () => {
    const html = buildDigestHtml([], [], [], base);
    expect(html).toContain("Keine Tasks abgeschlossen");
    expect(html).toContain("Keine laufenden Tasks");
    expect(html).toContain("Keine offenen Approval-Anfragen");
  });

  it("generates correct issue links using baseUrl", () => {
    const done = [makeIssue({ identifier: "FRDAA-42" })];
    const html = buildDigestHtml(done, [], [], base);
    expect(html).toContain("https://app.foerderis.de/FRDAA/issues/FRDAA-42");
  });
});

// ---------------------------------------------------------------------------
// Unit: fetchIssues
// ---------------------------------------------------------------------------

describe("fetchIssues", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("calls the correct URL and returns parsed issues", async () => {
    const issues = [makeIssue()];
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(issues), { status: 200 }),
    );

    const result = await fetchIssues(
      "http://paperclip.test",
      "company-id",
      "token",
      { status: "done" },
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://paperclip.test/api/companies/company-id/issues?status=done",
      expect.objectContaining({
        headers: { Authorization: "Bearer token" },
      }),
    );
    expect(result).toEqual(issues);
  });

  it("throws when Paperclip returns a non-OK status", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("", { status: 500 }),
    );
    await expect(
      fetchIssues("http://paperclip.test", "c", "t", { status: "done" }),
    ).rejects.toThrow("Paperclip query failed: 500");
  });
});

// ---------------------------------------------------------------------------
// Integration: POST handler
// ---------------------------------------------------------------------------

describe("POST /api/internal/daily-digest", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockSend.mockClear();
    // Clear env overrides
    for (const key of Object.keys(baseEnv)) {
      delete process.env[key];
    }
    delete process.env.INTERNAL_WEBHOOK_SECRET;
  });

  function applyEnv(overrides: Partial<typeof baseEnv> = {}) {
    const env = { ...baseEnv, ...overrides };
    for (const [k, v] of Object.entries(env)) {
      process.env[k] = v;
    }
  }

  function mockPaperclipFetch(
    done: PaperclipIssue[],
    inProgress: PaperclipIssue[],
    approval: PaperclipIssue[],
  ) {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify(done), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(inProgress), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(approval), { status: 200 }));
  }

  it("returns 503 when required env vars are missing", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.missing).toContain("RESEND_API_KEY");
  });

  it("returns 401 when secret is set but header is wrong", async () => {
    applyEnv();
    process.env.INTERNAL_WEBHOOK_SECRET = "secret123";

    const res = await POST(makeRequest({}, "wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("sends digest and returns stats", async () => {
    applyEnv();

    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 min ago — within 24h
    const oldDone = makeIssue({ identifier: "FRDAA-10", completedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() }); // 25h ago — outside 24h

    const doneIssues = [
      makeIssue({ identifier: "FRDAA-11", completedAt: yesterday }),
      oldDone,
    ];
    const inProgressIssues = [
      makeIssue({ identifier: "FRDAA-20", status: "in_progress", completedAt: null }),
    ];
    const approvalIssues = [
      makeIssue({ identifier: "FRDAA-30", status: "in_review", completedAt: null }),
    ];

    mockPaperclipFetch(doneIssues, inProgressIssues, approvalIssues);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.sent).toBe(true);
    expect(body.stats.done).toBe(1);       // only the recent one
    expect(body.stats.inProgress).toBe(1);
    expect(body.stats.needsApproval).toBe(1);

    expect(mockSend).toHaveBeenCalledOnce();
    const callArgs = mockSend.mock.calls[0][0] as { subject: string; html: string; to: string };
    expect(callArgs.to).toBe("felix@foerderis.de");
    expect(callArgs.subject).toMatch(/Tagesübersicht/);
    expect(callArgs.html).toContain("FRDAA-11");
    expect(callArgs.html).not.toContain("FRDAA-10"); // old done — filtered out
  });

  it("passes auth when secret matches", async () => {
    applyEnv();
    process.env.INTERNAL_WEBHOOK_SECRET = "secret123";

    mockPaperclipFetch([], [], []);

    const res = await POST(makeRequest({}, "secret123"));
    expect(res.status).toBe(200);
  });

  it("returns 500 when Paperclip fetch throws", async () => {
    applyEnv();
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network error"));

    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
  });
});
