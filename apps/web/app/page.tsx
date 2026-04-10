import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@foerderis/ui";
import { Card, CardContent } from "@foerderis/ui";
import { Clock, FileText, ShieldCheck } from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Wir lernen Ihr Unternehmen kennen",
    description:
      "Ein kurzes Gespräch. Wir erfassen Branche, Größe, Investitionsvorhaben und bisherige Förderhistorie — einmalig, ohne laufenden Aufwand Ihrerseits.",
  },
  {
    step: "2",
    title: "Unser KI-Team arbeitet rund um die Uhr",
    description:
      "Spezialisierte KI-Agenten scannen täglich alle deutschen und europäischen Förderprogramme, gleichen Treffer mit Ihrem Profil ab und formulieren revisionssichere Anträge.",
  },
  {
    step: "3",
    title: "Sie zahlen nur bei Bewilligung",
    description:
      "10 % der bewilligten Fördersumme — kein Abo, keine Grundgebühr, kein Risiko. Wenn das Geld auf Ihrem Konto eingeht, stellen wir Rechnung.",
  },
];

export default function Home() {
  return (
    <>
      <main id="main-content">
        {/* Hero */}
        <section className="relative flex min-h-[90svh] flex-col items-center justify-center px-4 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.4_0_0),transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Fördermittelberatung für den deutschen Mittelstand
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Wir werden nur bezahlt,{" "}
              <span className="text-primary">wenn Sie gefördert werden.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Ein KI-Team sucht rund um die Uhr für Sie — findet passende Förderprogramme,
              formuliert Anträge und überwacht Fristen. Sie zahlen 10 %, und nur dann, wenn die
              Förderung bewilligt wurde.
            </p>
            <Button asChild size="lg">
              <a href="#kontakt">Jetzt unverbindlich anfragen</a>
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-20" aria-labelledby="how-heading">
          <div className="mx-auto max-w-5xl">
            <h2
              id="how-heading"
              className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground"
            >
              So funktioniert es
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Drei Schritte — und dann arbeiten wir, nicht Sie.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, title, description }) => (
                <Card key={step}>
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-foreground">
                      {step}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing — prominent */}
        <section className="px-4 py-20" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-border bg-secondary/30 p-8 text-center">
              <h2
                id="pricing-heading"
                className="mb-4 text-3xl font-bold tracking-tight text-foreground"
              >
                10 % — nur bei Bewilligung
              </h2>
              <p className="mb-6 text-muted-foreground">
                Keine Einrichtungsgebühr. Keine monatliche Pauschale. Kein Retainer.
              </p>
              <ul className="mb-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Wenn wir keine passende Förderung finden — zahlen Sie nichts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Wenn der Antrag nicht durchgeht — zahlen Sie nichts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Nur wenn das Geld auf Ihrem Konto eingeht, stellen wir 10 % in Rechnung.
                  </span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground">
                Das entspricht der unteren Hälfte des marktüblichen Honorars für deutsche
                Fördermittelberater — ohne das übliche Vorabrisiko.
              </p>
            </div>
          </div>
        </section>

        {/* Für wen */}
        <section className="px-4 py-20" aria-labelledby="audience-heading">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2
                  id="audience-heading"
                  className="mb-6 text-3xl font-bold tracking-tight text-foreground"
                >
                  Für wen wir arbeiten
                </h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <strong className="text-foreground">
                        Mittelstand mit 10 bis 250 Mitarbeitern
                      </strong>{" "}
                      — GmbH, GmbH &amp; Co. KG, AG. Unternehmen mit greifbarer deutscher
                      Wertschöpfung.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      Geschäftsführer und kaufmännische Leitungen, die wissen, dass Förderung da
                      wäre — aber keine Zeit haben, ihr nachzujagen.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      Branchen: Maschinenbau, Fertigung, Handwerk, mittelständische IT, Energie,
                      Bau.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Was wir NICHT sind */}
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
                  Was wir nicht sind
                </h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong className="text-foreground">Kein SaaS-Tool.</strong> Sie bedienen
                      keine Software. Wir übernehmen die Arbeit vollständig.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong className="text-foreground">Kein Chatbot.</strong> Kein Self-Service,
                      kein Login-Bereich, keine Matching-Datenbank zum Selbstdurchsuchen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong className="text-foreground">Nicht für Startups.</strong> Unsere
                      Methodik ist auf etablierten deutschen Mittelstand ausgerichtet — nicht auf
                      pre-revenue Gründungsvorhaben.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong className="text-foreground">Nicht international.</strong> Wir arbeiten
                      ausschließlich mit deutschen Unternehmen nach deutschem Recht.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Capture Form */}
        <section id="kontakt" className="px-4 py-20" aria-labelledby="contact-heading">
          <div className="mx-auto max-w-md">
            <h2
              id="contact-heading"
              className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground"
            >
              Unverbindlich anfragen
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Wir prüfen, ob Foerderis zu Ihrem Unternehmen passt — und melden uns innerhalb von
              zwei Werktagen.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Foerderis. Alle Rechte vorbehalten.
          </p>
          <nav aria-label="Footer-Navigation" className="flex gap-6">
            <a
              href="/faq"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              FAQ
            </a>
            <a
              href="/impressum"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Impressum
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
