import { Button } from "@foerderis/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum — FörderPilot",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Impressum</h1>

      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            [Unternehmensname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ Ort]
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Vertreten durch</h2>
          <p className="mt-2">[Geschäftsführer/in]</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Kontakt</h2>
          <p className="mt-2">E-Mail: [kontakt@example.com]</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Registereintrag</h2>
          <p className="mt-2">
            Eintragung im Handelsregister.
            <br />
            Registergericht: [Amtsgericht]
            <br />
            Registernummer: [HRB XXXXX]
          </p>
        </section>

        <p className="text-xs text-muted-foreground/60">
          Dieses Impressum ist ein Platzhalter und wird vor dem Launch mit den vollständigen Angaben
          befüllt.
        </p>
      </div>

      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/">← Zurück zur Startseite</Link>
        </Button>
      </div>
    </main>
  );
}
