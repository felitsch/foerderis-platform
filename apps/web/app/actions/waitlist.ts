"use server";

import { waitlistFormSchema } from "@foerderpilot/shared";

export type WaitlistState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitWaitlist(
  _prevState: WaitlistState,
  formData: FormData
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

  try {
    // Dynamic import keeps the module-level DATABASE_URL check out of build time
    const { db, waitlist } = await import("@foerderpilot/db");
    await db.insert(waitlist).values(parsed.data);
    return { status: "success" };
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
}
