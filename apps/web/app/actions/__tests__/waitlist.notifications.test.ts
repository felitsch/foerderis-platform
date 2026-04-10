import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Module-level mocks — must be hoisted before any imports of the module under
// test.  We mock the two external I/O surfaces: Resend and fetch.
// ---------------------------------------------------------------------------

// Mock `resend` package
vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({ data: { id: "email-id" }, error: null });
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
    })),
    __mockSend: mockSend,
  };
});

// Mock `@foerderis/db` — avoids DATABASE_URL requirement
vi.mock("@foerderis/db", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
  waitlist: {},
}));

// Mock `@foerderis/shared` — minimal schema that passes
vi.mock("@foerderis/shared", () => ({
  waitlistFormSchema: {
    safeParse: vi.fn((data) => ({
      success: true,
      data: { email: data.email, companyName: data.companyName },
    })),
  },
}));

// ---------------------------------------------------------------------------
// Import the module under test AFTER the mocks are hoisted
// ---------------------------------------------------------------------------
import { submitWaitlist } from "../waitlist";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFormData(email: string, companyName: string): FormData {
  const fd = new FormData();
  fd.set("email", email);
  fd.set("companyName", companyName);
  return fd;
}

function mockFetch(ok: boolean, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    text: () => Promise.resolve(ok ? "OK" : "Internal Server Error"),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("submitWaitlist — notification side-effects", () => {
  const idle = { status: "idle" as const };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env vars
    delete process.env.RESEND_API_KEY;
    delete process.env.PAPERCLIP_API_URL;
    delete process.env.PAPERCLIP_COMPANY_ID;
    delete process.env.PAPERCLIP_CEO_AGENT_ID;
    delete process.env.PAPERCLIP_SYSTEM_TOKEN;
    delete process.env.NOTIFICATION_EMAIL;
  });

  it("returns success even when RESEND_API_KEY and Paperclip vars are absent", async () => {
    const result = await submitWaitlist(idle, makeFormData("lead@acme.de", "Acme GmbH"));
    expect(result).toEqual({ status: "success" });
  });

  it("sends two emails when RESEND_API_KEY is set", async () => {
    process.env.RESEND_API_KEY = "re_test_key";

    const { Resend } = await import("resend");
    const instance = new (Resend as any)();
    const sendSpy = instance.emails.send;

    const result = await submitWaitlist(idle, makeFormData("lead@acme.de", "Acme GmbH"));
    expect(result).toEqual({ status: "success" });
    // confirmation + internal alert
    expect(sendSpy).toHaveBeenCalledTimes(2);
  });

  it("sends confirmation email to the lead's address", async () => {
    process.env.RESEND_API_KEY = "re_test_key";

    const { Resend } = await import("resend");
    const instance = new (Resend as any)();
    const sendSpy = instance.emails.send;

    await submitWaitlist(idle, makeFormData("ceo@startup.de", "Startup AG"));

    const calls = sendSpy.mock.calls.map((c: any) => c[0]);
    const confirmCall = calls.find((c: any) => c.to === "ceo@startup.de");
    expect(confirmCall).toBeDefined();
    expect(confirmCall.subject).toContain("Danke");
  });

  it("sends internal alert to felix@foerderis.de by default", async () => {
    process.env.RESEND_API_KEY = "re_test_key";

    const { Resend } = await import("resend");
    const instance = new (Resend as any)();
    const sendSpy = instance.emails.send;

    await submitWaitlist(idle, makeFormData("lead@corp.de", "Corp KG"));

    const calls = sendSpy.mock.calls.map((c: any) => c[0]);
    const alertCall = calls.find((c: any) => c.to === "felix@foerderis.de");
    expect(alertCall).toBeDefined();
    expect(alertCall.subject).toContain("Corp KG");
  });

  it("sends internal alert to NOTIFICATION_EMAIL env var when set", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.NOTIFICATION_EMAIL = "alerts@example.com";

    const { Resend } = await import("resend");
    const instance = new (Resend as any)();
    const sendSpy = instance.emails.send;

    await submitWaitlist(idle, makeFormData("lead@corp.de", "Corp KG"));

    const calls = sendSpy.mock.calls.map((c: any) => c[0]);
    const alertCall = calls.find((c: any) => c.to === "alerts@example.com");
    expect(alertCall).toBeDefined();
  });

  it("creates a Paperclip task when all env vars are set", async () => {
    process.env.PAPERCLIP_API_URL = "https://api.example.com";
    process.env.PAPERCLIP_COMPANY_ID = "company-123";
    process.env.PAPERCLIP_CEO_AGENT_ID = "agent-ceo-456";
    process.env.PAPERCLIP_SYSTEM_TOKEN = "sys_token_789";

    global.fetch = mockFetch(true);

    const result = await submitWaitlist(idle, makeFormData("lead@acme.de", "Acme GmbH"));
    expect(result).toEqual({ status: "success" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/api/companies/company-123/issues",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer sys_token_789",
        }),
      }),
    );

    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(body.title).toBe("Lead qualifizieren: Acme GmbH");
    expect(body.assigneeAgentId).toBe("agent-ceo-456");
    expect(body.description).toContain("lead@acme.de");
  });

  it("still returns success when Paperclip API call fails", async () => {
    process.env.PAPERCLIP_API_URL = "https://api.example.com";
    process.env.PAPERCLIP_COMPANY_ID = "company-123";
    process.env.PAPERCLIP_CEO_AGENT_ID = "agent-ceo-456";
    process.env.PAPERCLIP_SYSTEM_TOKEN = "sys_token_789";

    global.fetch = mockFetch(false, 500);

    const result = await submitWaitlist(idle, makeFormData("lead@acme.de", "Acme GmbH"));
    expect(result).toEqual({ status: "success" });
  });

  it("returns success when email send fails (lead already in DB)", async () => {
    process.env.RESEND_API_KEY = "re_test_key";

    const { Resend } = await import("resend");
    const instance = new (Resend as any)();
    instance.emails.send.mockRejectedValue(new Error("Network error"));

    const result = await submitWaitlist(idle, makeFormData("lead@acme.de", "Acme GmbH"));
    expect(result).toEqual({ status: "success" });
  });
});

describe("submitWaitlist — DB layer", () => {
  const idle = { status: "idle" as const };

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.RESEND_API_KEY;
  });

  it("returns error with duplicate message on unique constraint violation", async () => {
    const { waitlistFormSchema } = await import("@foerderis/shared");
    (waitlistFormSchema.safeParse as any).mockReturnValueOnce({
      success: true,
      data: { email: "dup@acme.de", companyName: "Acme GmbH" },
    });

    const { db } = await import("@foerderis/db");
    (db.insert as any).mockReturnValueOnce({
      values: vi.fn().mockRejectedValueOnce(new Error("unique constraint")),
    });

    const result = await submitWaitlist(idle, makeFormData("dup@acme.de", "Acme GmbH"));
    expect(result).toEqual({
      status: "error",
      message: "Diese E-Mail-Adresse ist bereits registriert.",
    });
  });

  it("returns error with generic message on unexpected DB error", async () => {
    const { waitlistFormSchema } = await import("@foerderis/shared");
    (waitlistFormSchema.safeParse as any).mockReturnValueOnce({
      success: true,
      data: { email: "x@acme.de", companyName: "Acme" },
    });

    const { db } = await import("@foerderis/db");
    (db.insert as any).mockReturnValueOnce({
      values: vi.fn().mockRejectedValueOnce(new Error("connection refused")),
    });

    const result = await submitWaitlist(idle, makeFormData("x@acme.de", "Acme"));
    expect(result).toEqual({
      status: "error",
      message: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
    });
  });

  it("returns validation error when schema parse fails", async () => {
    const { waitlistFormSchema } = await import("@foerderis/shared");
    (waitlistFormSchema.safeParse as any).mockReturnValueOnce({
      success: false,
      error: { errors: [{ message: "Ungültige E-Mail-Adresse." }] },
    });

    const result = await submitWaitlist(idle, makeFormData("not-an-email", "Acme"));
    expect(result).toEqual({
      status: "error",
      message: "Ungültige E-Mail-Adresse.",
    });
  });
});
