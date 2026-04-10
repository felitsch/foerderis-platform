import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@foerderpilot/ui";
import { Card, CardContent } from "@foerderpilot/ui";
import { FileText, Search, ShieldCheck } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Search,
    title: "Automatische Förderrecherche",
    description:
      "Wir scannen täglich alle verfügbaren Förderprogramme auf Bundes-, Landes- und EU-Ebene — und zeigen Ihnen nur die, die wirklich zu Ihrem Unternehmen passen.",
  },
  {
    icon: FileText,
    title: "KI-gestützte Antragsvorbereitung",
    description:
      "Vom passenden Förderprogramm zum fertigen Entwurf in Minuten. FörderPilot erstellt auf Basis Ihrer Angaben einen vollständigen Antragsentwurf.",
  },
  {
    icon: ShieldCheck,
    title: "Integrierter Compliance-Check",
    description:
      "Automatische Prüfung aller Fördervoraussetzungen und Nachweispflichten — damit Ihr Antrag beim ersten Versuch genehmigt wird.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[90svh] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.4_0_0),transparent)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Jetzt in der Beta-Phase
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Nie wieder <span className="text-primary">Fördermittel</span> verpassen.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground sm:text-xl">
            KI-gestützte Förderrecherche, Antragsvorbereitung und Compliance-Prüfung — speziell für
            den deutschen Mittelstand.
          </p>
          <Button asChild size="lg">
            <a href="#warteliste">Jetzt auf die Warteliste</a>
          </Button>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="px-4 py-20" aria-labelledby="value-heading">
        <div className="mx-auto max-w-5xl">
          <h2
            id="value-heading"
            className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground"
          >
            Was FörderPilot für Sie tut
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section id="warteliste" className="px-4 py-20" aria-labelledby="waitlist-heading">
        <div className="mx-auto max-w-md">
          <h2
            id="waitlist-heading"
            className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground"
          >
            Früher Zugang sichern
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            Tragen Sie sich jetzt ein und gehören Sie zu den Ersten, die FörderPilot nutzen.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FörderPilot. Alle Rechte vorbehalten.
          </p>
          <nav aria-label="Footer-Navigation">
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
