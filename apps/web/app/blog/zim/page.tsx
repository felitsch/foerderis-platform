import { Button } from "@foerderis/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Was ist ZIM? Das Zentrale Innovationsprogramm Mittelstand erklärt — Foerderis",
  description:
    "ZIM ist das BMWK-Förderprogramm für F&E-Kooperationen im Mittelstand — bundesweit, ohne feste Frist. KMU bis 500 Mitarbeiter können 45–55 % der Kosten erstattet bekommen, Fördervolumen von 100.000 bis 2 Mio. EUR.",
  alternates: {
    canonical: "/blog/zim",
  },
  openGraph: {
    title: "Was ist ZIM? Das Zentrale Innovationsprogramm Mittelstand erklärt",
    description:
      "ZIM fördert F&E-Vorhaben und Kooperationen im deutschen Mittelstand mit 45–55 % der Kosten. Alles zu Voraussetzungen, Förderhöhe und Bewerbungsablauf — rollierend einreichbar.",
    type: "article",
    url: "https://foerderis.de/blog/zim",
    locale: "de_DE",
    siteName: "Foerderis",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Was ist ZIM? Das Zentrale Innovationsprogramm Mittelstand erklärt",
  description:
    "ZIM ist das BMWK-Förderprogramm für F&E-Kooperationen im Mittelstand — bundesweit, ohne feste Frist. KMU bis 500 Mitarbeiter können 45–55 % der Kosten erstattet bekommen.",
  author: {
    "@type": "Organization",
    name: "Foerderis",
    url: "https://foerderis.de",
  },
  publisher: {
    "@type": "Organization",
    name: "Foerderis",
    url: "https://foerderis.de",
  },
  inLanguage: "de",
  datePublished: "2026-04-11",
};

export default function ZimPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data, no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-2xl px-4 py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline underline-offset-4">
            Startseite
          </Link>
          <span className="mx-2">/</span>
          <span>ZIM</span>
        </nav>

        <article>
          <header className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Förderprogramm · Bundesweit
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground">
              Was ist ZIM? Das Zentrale Innovationsprogramm Mittelstand erklärt
            </h1>
            <p className="text-lg text-muted-foreground">
              ZIM ist das wichtigste Bundesprogramm für Forschungs- und Entwicklungskooperationen
              im deutschen Mittelstand. KMU bis 500 Mitarbeiter können gemeinsam mit
              Forschungseinrichtungen bis zu 55 % ihrer F&E-Kosten erstattet bekommen — bei einem
              Fördervolumen von 100.000 bis 2 Mio. EUR. Einzureichen{" "}
              <strong className="text-foreground">jederzeit, ohne feste Antragsfrist</strong>.
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground">
            {/* Section 1 */}
            <section aria-labelledby="was-ist">
              <h2
                id="was-ist"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Was ist ZIM?
              </h2>
              <p>
                Das Zentrale Innovationsprogramm Mittelstand (ZIM) ist ein Förderprogramm des
                Bundesministeriums für Wirtschaft und Klimaschutz (BMWK). Es unterstützt kleine
                und mittlere Unternehmen sowie mittelständische Großunternehmen, die in
                Kooperation mit Forschungseinrichtungen oder anderen Unternehmen neue Produkte,
                Verfahren oder Dienstleistungen entwickeln.
              </p>
              <p className="mt-4">
                ZIM ist seit 2008 eines der volumenreichsten deutschen Innovationsförderprogramme
                und wird vollständig aus dem Bundeshaushalt finanziert — ohne EFRE-Mittel. Das
                macht es regional ungebunden und bundesweit zugänglich. Besonders attraktiv: ZIM
                läuft als rollierende Förderung ohne feste Antragsfristen. Anträge können das
                ganze Jahr über eingereicht werden, solange Haushaltsmittel vorhanden sind.
              </p>
            </section>

            {/* Section 2 */}
            <section aria-labelledby="wer-qualifiziert">
              <h2
                id="wer-qualifiziert"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Wer qualifiziert sich?
              </h2>
              <p>Antragsberechtigt sind Unternehmen und Forschungseinrichtungen, die folgende
                Voraussetzungen erfüllen:</p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">KMU bis 500 Mitarbeiter</strong> —
                    erweiterte KMU-Definition gegenüber dem EU-Standard (dort: bis 250 MA),
                    bundesweit ohne Standortbindung
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Forschungseinrichtungen als Partner</strong> —
                    Universitäten, Fachhochschulen, außeruniversitäre Institute und vergleichbare
                    Einrichtungen können als Kooperationspartner eingebunden werden
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">F&E-Vorhaben mit technologischem Neuheitscharakter</strong> —
                    das Projekt muss über den Stand der Technik hinausgehen und wirtschaftlich
                    verwertbare Ergebnisse anstreben
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Alle Branchen</strong> — ZIM ist
                    technologieoffen und branchenneutral. Maschinenbau, Fertigung, IT,
                    Energie, Gesundheit — jedes Feld mit echtem F&E-Anteil ist förderfähig
                  </span>
                </li>
              </ul>
              <p className="mt-4">
                ZIM fördert drei Projektformen: Einzelprojekte eines Unternehmens,
                Kooperationsprojekte zwischen Unternehmen sowie Kooperationen zwischen
                Unternehmen und Forschungseinrichtungen. Die dritte Variante — Unternehmen plus
                Forschung — wird bei der Bewertung besonders positiv gewichtet.
              </p>
            </section>

            {/* Section 3 */}
            <section aria-labelledby="was-wird-gefoerdert">
              <h2
                id="was-wird-gefoerdert"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Was wird gefördert?
              </h2>
              <p>
                ZIM finanziert die direkten Kosten eines F&E-Vorhabens: Personal, Aufträge an
                Dritte (z. B. spezialisierte Labore) und projektbezogene Sachkosten. Die
                Förderquote richtet sich nach Unternehmensgröße und Projekttyp:
              </p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">45 % der förderfähigen Kosten</strong> für
                    Unternehmen mit mehr als 100 Mitarbeitern
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">50 % der förderfähigen Kosten</strong> für
                    Unternehmen bis 100 Mitarbeitern
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">55 % der förderfähigen Kosten</strong> bei
                    Kooperationen mit Forschungseinrichtungen — der häufigste und attraktivste Fall
                  </span>
                </li>
              </ul>
              <p className="mt-4">
                Das Fördervolumen liegt zwischen{" "}
                <strong className="text-foreground">100.000 und 2 Mio. EUR</strong> pro Vorhaben.
                Bei Kooperationsprojekten wird das Gesamtbudget auf alle Partner aufgeteilt —
                jeder Partner stellt seinen eigenen Antrag.
              </p>
            </section>

            {/* Section 4 */}
            <section aria-labelledby="bewerbungsablauf">
              <h2
                id="bewerbungsablauf"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Wie läuft der Bewerbungsprozess ab?
              </h2>
              <p>
                ZIM funktioniert rollierend: Es gibt keine festen Einreichfristen. Anträge werden
                das ganze Jahr über geprüft — in der Reihenfolge ihres Eingangs.
              </p>
              <ol className="mt-4 space-y-5 list-none">
                <li className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">
                    1
                  </span>
                  <div>
                    <strong className="text-foreground">Projektskizze einreichen</strong>
                    <p className="mt-1">
                      Optional, aber empfehlenswert: Vor dem formalen Antrag kann eine kurze
                      Projektskizze beim Projektträger eingereicht werden. Die Skizze umreißt
                      Ziel, Neuheitscharakter und Verwertungsplan auf 3–5 Seiten. Rückmeldung
                      in der Regel innerhalb von 4 Wochen — so lässt sich frühzeitig
                      einschätzen, ob das Vorhaben grundsätzlich förderfähig ist.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">
                    2
                  </span>
                  <div>
                    <strong className="text-foreground">Formalen Antrag stellen</strong>
                    <p className="mt-1">
                      Der Antrag wird über das easy-Online-Portal des Bundes eingereicht und
                      umfasst Projektbeschreibung, Arbeits- und Zeitplan, Finanzierungsplan
                      sowie Unternehmensangaben. Bei Kooperationsprojekten reicht jeder Partner
                      einen separaten Antrag ein — die Kooperationsvereinbarung wird
                      beigefügt.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">
                    3
                  </span>
                  <div>
                    <strong className="text-foreground">Bewilligung und Projektstart</strong>
                    <p className="mt-1">
                      Nach fachlicher Begutachtung durch den Projektträger und positivem Bescheid
                      wird der Zuwendungsbescheid ausgestellt. Die Fördermittel werden auf Nachweis
                      der angefallenen Kosten abgerufen. Von Antragstellung bis Projektstart sind
                      realistisch{" "}
                      <strong className="text-foreground">3–6 Monate</strong> einzuplanen.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* Section 5 */}
            <section aria-labelledby="besonderheit">
              <h2
                id="besonderheit"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Besonderheit: Kooperationen werden bevorzugt
              </h2>
              <p>
                ZIM ist eines der wenigen Bundesprogramme, das Kooperationen zwischen Unternehmen
                und Forschungseinrichtungen strukturell bevorzugt. Die höchste Förderquote (55 %)
                gilt genau für diese Konstellation. Unternehmen, die einen Forschungspartner
                einbinden — etwa eine Hochschule, ein Fraunhofer-Institut oder eine
                Transfereinrichtung — profitieren also doppelt: durch bessere Förderquoten und
                durch den Zugang zu Forschungsinfrastruktur, die intern kaum vorhaltbar wäre.
              </p>
              <p className="mt-4">
                Für Mittelständler ohne eigene F&E-Abteilung ist dieser Ansatz besonders
                interessant: Das Unternehmen bringt die Problemstellung und das
                Verwertungsinteresse mit; die Forschungseinrichtung liefert Methodik und
                Ressourcen. Der Projektträger bewertet die Qualität der Zusammenarbeit — ein
                gut begründetes Kooperationsvorhaben hat erfahrungsgemäß bessere
                Bewilligungsaussichten als ein reines Einzelprojekt.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-border bg-secondary/30 p-8">
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
              Passt ZIM zu Ihrem Unternehmen?
            </h2>
            <p className="mb-6 text-muted-foreground">
              ZIM ist rollierend — Sie können jederzeit einreichen. Frühzeitig ist besser: Je
              früher der Antrag eingereicht wird, desto früher kann das Projekt starten.
              Foerderis prüft kostenlos, ob Ihr Vorhaben förderfähig ist — und übernimmt auf
              Wunsch Skizze, Antrag und Partnervermittlung. Sie zahlen 10 % der bewilligten
              Summe, und nur dann, wenn das Geld auf Ihrem Konto eingeht.
            </p>
            <Button asChild size="lg">
              <Link href="/#kontakt">Kostenloses Erstgespräch buchen</Link>
            </Button>
          </div>
        </article>

        <div className="mt-12">
          <Button asChild variant="outline">
            <Link href="/">← Zurück zur Startseite</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
