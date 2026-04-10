import { Button } from "@foerderis/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Was ist KMU-innovativ? Und wer qualifiziert sich? — Foerderis",
  description:
    "KMU-innovativ ist das BMBF-Förderprogramm für forschungsintensive Mittelständler. Wer bis zu 250 Mitarbeiter hat und F&E-Vorhaben in Zukunftsfeldern plant, kann bis zu 60 % der Kosten erstattet bekommen.",
  alternates: {
    canonical: "/blog/kmu-innovativ",
  },
  openGraph: {
    title: "Was ist KMU-innovativ? Und wer qualifiziert sich?",
    description:
      "KMU-innovativ fördert F&E-Vorhaben kleiner und mittlerer Unternehmen mit bis zu 60 % der Kosten. Alles zu Voraussetzungen, Förderhöhe und Bewerbungsablauf.",
    type: "article",
    url: "https://foerderis.de/blog/kmu-innovativ",
    locale: "de_DE",
    siteName: "Foerderis",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Was ist KMU-innovativ? Und wer qualifiziert sich?",
  description:
    "KMU-innovativ ist das BMBF-Förderprogramm für forschungsintensive Mittelständler. Wer bis zu 250 Mitarbeiter hat und F&E-Vorhaben in Zukunftsfeldern plant, kann bis zu 60 % der Kosten erstattet bekommen.",
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
  datePublished: "2026-04-10",
};

export default function KmuInnovativPage() {
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
          <span>KMU-innovativ</span>
        </nav>

        <article>
          <header className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Förderprogramm
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground">
              Was ist KMU-innovativ? Und wer qualifiziert sich?
            </h1>
            <p className="text-lg text-muted-foreground">
              Das BMBF-Programm KMU-innovativ richtet sich an forschungsaktive kleine und
              mittelständische Unternehmen — und bietet Förderquoten von bis zu 60 %. Was dahinter
              steckt, wer antragsberechtigt ist und wie der Prozess abläuft.
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground">
            {/* Section 1 */}
            <section aria-labelledby="was-ist">
              <h2
                id="was-ist"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Was ist KMU-innovativ?
              </h2>
              <p>
                KMU-innovativ ist ein Förderprogramm des Bundesministeriums für Bildung und
                Forschung (BMBF). Es richtet sich gezielt an kleine und mittlere Unternehmen, die
                risikoreiche Forschungs- und Entwicklungsvorhaben angehen wollen — und dafür
                normalerweise keine ausreichende Eigenfinanzierung hätten.
              </p>
              <p className="mt-4">
                Das Programm wurde bewusst niedrigschwellig gestaltet: keine festen Einreichfristen,
                kein Themenkorsett. Stattdessen können Unternehmen ihre Skizzen jederzeit einreichen
                und erhalten in der Regel innerhalb weniger Monate eine erste Rückmeldung. Das macht
                KMU-innovativ zu einem der flexibelsten F&E-Förderprogramme des Bundes.
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
              <p>Antragsberechtigt sind Unternehmen, die die EU-Definition eines KMU erfüllen:</p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Bis zu 250 Mitarbeiter</strong>{" "}
                    (Vollzeitäquivalente)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Jahresumsatz bis 50 Mio. €</strong> oder
                    Bilanzsumme bis 43 Mio. €
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Unternehmenssitz in Deutschland</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    Geplantes Vorhaben in einem der geförderten{" "}
                    <strong className="text-foreground">Zukunftsfelder</strong>: u. a. Informations-
                    und Kommunikationstechnologien, Maschinenbau, Produktionstechnologien,
                    Biotechnologie, Ressourceneffizienz, Photonik oder Quantentechnologien
                  </span>
                </li>
              </ul>
              <p className="mt-4">
                Auch Verbundprojekte — gemeinsam mit anderen Unternehmen oder
                Forschungseinrichtungen — sind förderfähig. In vielen Themenfeldern werden
                Kooperationen sogar ausdrücklich begrüßt.
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
                KMU-innovativ finanziert industrie- und technologiegetriebene F&E-Vorhaben mit
                klarem Innovationscharakter. Gefördert werden Personal-, Sach- und Reisekosten, die
                direkt dem Forschungsvorhaben zuzurechnen sind.
              </p>
              <p className="mt-4">Die Förderquoten sind attraktiv:</p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">50 % der förderfähigen Kosten</strong> als
                    Standardsatz
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Bis zu 60 %</strong> für kleine Unternehmen
                    (unter 50 Mitarbeiter)
                  </span>
                </li>
              </ul>
              <p className="mt-4">
                Typische bewilligte Fördersummen bewegen sich zwischen{" "}
                <strong className="text-foreground">100.000 und 500.000 EUR</strong> pro Projekt —
                größere Vorhaben mit mehreren Partnern können deutlich darüber liegen.
              </p>
            </section>

            {/* Section 4 */}
            <section aria-labelledby="bewerbungsablauf">
              <h2
                id="bewerbungsablauf"
                className="mb-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                Wie läuft die Bewerbung ab?
              </h2>
              <p>
                Der Prozess läuft in zwei Stufen. Wer die erste Hürde nimmt, hat gute Chancen auf
                Bewilligung:
              </p>
              <ol className="mt-4 space-y-5 list-none">
                <li className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">
                    1
                  </span>
                  <div>
                    <strong className="text-foreground">Projektskizze</strong>
                    <p className="mt-1">
                      Umfang ca. 10–15 Seiten: Beschreibung des Vorhabens, technische Ziele,
                      Arbeitsplan, Verwertungskonzept. Die Skizze kann jederzeit eingereicht werden
                      — es gibt keine festen Stichtage. Rückmeldung vom Projektträger in der Regel
                      nach 6–8 Wochen.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">
                    2
                  </span>
                  <div>
                    <strong className="text-foreground">Vollantrag</strong>
                    <p className="mt-1">
                      Nur auf Einladung nach positiver Skizzenbewertung. Detaillierter Arbeits- und
                      Finanzierungsplan, Meilensteine, Bonitätsnachweis. Die Bearbeitungszeit bis
                      zur Bewilligung beträgt typisch weitere 2–3 Monate.
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
                      Nach Bewilligung beginnt die Förderperiode. Mittel werden auf Antrag abgerufen
                      — die Fördermittel fließen direkt, nicht rückwirkend. Von Skizzeneinreichung
                      bis Projektstart vergehen realistisch{" "}
                      <strong className="text-foreground">3–6 Monate</strong>.
                    </p>
                  </div>
                </li>
              </ol>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-border bg-secondary/30 p-8">
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
              Passt KMU-innovativ zu Ihrem Unternehmen?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Foerderis prüft kostenlos, ob Ihr Vorhaben förderfähig ist — und übernimmt auf Wunsch
              Skizze, Vollantrag und Fristenmanagement. Sie zahlen 10 % der bewilligten Summe, und
              nur dann, wenn das Geld auf Ihrem Konto eingeht.
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
