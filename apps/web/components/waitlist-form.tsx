"use client";

import { type WaitlistState, submitWaitlist } from "@/app/actions/waitlist";
import { Button } from "@foerderis/ui";
import { Input } from "@foerderis/ui";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useActionState } from "react";

const initialState: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, action, isPending] = useActionState(submitWaitlist, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle className="size-10 text-green-500" />
        <p className="text-lg font-semibold text-foreground">
          Vielen Dank! Sie stehen auf der Liste.
        </p>
        <p className="text-sm text-muted-foreground">
          Wir melden uns innerhalb von zwei Werktagen bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" aria-describedby="required-fields-hint">
      <p id="required-fields-hint" className="text-xs text-muted-foreground">
        <span aria-hidden="true">*</span> Pflichtfeld
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          E-Mail-Adresse <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="max@mustermann-gmbh.de"
          required
          aria-required="true"
          disabled={isPending}
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="companyName" className="text-sm font-medium text-foreground">
          Firmenname <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="Mustermann GmbH"
          required
          aria-required="true"
          disabled={isPending}
          autoComplete="organization"
        />
      </div>

      {state.status === "error" && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Wird eingetragen…
          </>
        ) : (
          "Jetzt vormerken lassen"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Kein Spam. Nur eine Nachricht, wenn es losgeht.
      </p>
    </form>
  );
}
