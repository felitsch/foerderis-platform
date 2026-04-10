import { Button } from "@foerderis/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Häufige Fragen zu Foerderis",
  description:
    "Antworten auf die häufigsten Fragen zu Foerderis: Kosten, Förderprogramme, Ablauf und Zusammenarbeit. Nur 10 % Erfolgshonorar — kein Risiko.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ — Häufige Fragen zu Foerderis",
    description:
      "Antworten auf die häufigsten Fragen zu Foerderis: Kosten, Förderprogramme, Ablauf und Zusammenarbeit.",
    url: "https://foerderis.de/faq",
  },
};

const FAQ_CATEGORIES = [
  {
    title: "Zum Modell",
    items: [
      {
        question: "Was kostet Foerderis?",
        answer:
          "10 % der bewilligten Fördersumme — und nur dann, wenn die Förderung tatsächlich auf Ihrem Konto eingeht. Keine Einrichtungsgebühr, keine monatliche Pauschale, kein Retainer. Wenn wir keine passende Förderung finden oder der Antrag abgelehnt wird, zahlen Sie nichts.",
      },
      {
        question: "Was passiert, wenn der Antrag abgelehnt wird?",
        answer:
          "Nichts. Sie zahlen in diesem Fall keinen Cent. Das Risiko liegt vollständig bei uns — deshalb prüfen wir sorgfältig, bevor wir einen Antrag stellen. Unser Interesse ist deckungsgleich mit Ihrem: Wir wollen, dass die Förderung bewilligt wird.",
      },
      {
        question: "Wer eignet sich als Kunde?",
        answer:
          "Foerderis arbeitet mit deutschen kleinen und mittelständischen Unternehmen: 10 bis 250 Mitarbeiter, Umsatz 2 bis 50 Mio. €, Rechtsform GmbH, GmbH & Co. KG oder AG. Typische Branchen: Maschinenbau, Fertigung, Handwerk, mittelständische IT, Energie, Bau. Wir arbeiten nicht mit Pre-Revenue-Startups oder reinen Dienstleistungsunternehmen ohne greifbare Investitionen.",
      },
    ],
  },
  {
    title: "Zur Förderung",
    items: [
      {
        question: "Welche Förderprogramme deckt ihr ab?",
        answer:
          "Wir decken ein breites Spektrum an deutschen und europäischen Förderprogrammen ab — darunter KMU-innovativ (BMBF), IBB Pro FIT, EXIST, ZIM (Zentrales Innovationsprogramm Mittelstand), EFRE-Programme der Bundesländer sowie ausgewählte EU-Programme wie Horizon Europe. Unser KI-Team scannt täglich alle aktiven Ausschreibungen und gleicht sie mit Ihrem Unternehmensprofil ab.",
      },
      {
        question: "Wie lange dauert es bis zum ersten Antrag?",
        answer:
          "Nach dem Erstgespräch und der Profil-Aufnahme dauert es in der Regel zwei bis vier Wochen bis zum ersten konkreten Antragsentwurf. Die Gesamtdauer hängt vom jeweiligen Förderprogramm ab: Manche Programme haben laufende Einreichungsfristen, andere feste Stichtage. Wir informieren Sie proaktiv über relevante Fristen.",
      },
      {
        question: "Wie hoch sind typische Förderbeträge?",
        answer:
          "Das variiert stark nach Programm und Vorhaben. Kleine Innovationsprojekte starten häufig bei 50.000 €, größere Vorhaben über ZIM oder EFRE können 500.000 € und mehr erreichen. Wir legen keinen Mindestbetrag fest — aber wir prüfen ehrlich, ob der Aufwand für ein Vorhaben in einem gesunden Verhältnis zur erwarteten Fördersumme steht.",
      },
    ],
  },
  {
    title: "Zur Zusammenarbeit",
    items: [
      {
        question: "Was müssen wir als Kunde tun?",
        answer:
          "Im Wesentlichen zwei Dinge: Einmalig ein Erstgespräch zur Profil-Aufnahme (ca. 60 Minuten) und die Bereitstellung relevanter Unterlagen (Jahresabschluss, Projektbeschreibungen, Investitionspläne). Den Rest übernimmt unser KI-Team — Recherche, Antragsentwurf, Fristenmanagement und Compliance-Prüfung. Sie genehmigen Anträge vor der Einreichung, aber wir bereiten alles vor.",
      },
      {
        question: "Wie ist der Ablauf Schritt für Schritt?",
        answer:
          "1. Erstgespräch: Wir erfassen Ihr Unternehmensprofil, Investitionsvorhaben und Förderhistorie.\n2. Matching: Unser KI-Team gleicht Ihr Profil mit allen aktuellen Förderprogrammen ab.\n3. Antragsentwurf: Wir formulieren revisionssichere Anträge und legen sie Ihnen zur Freigabe vor.\n4. Einreichung: Nach Ihrer Freigabe reichen wir den Antrag ein und überwachen den Prozess.\n5. Bewilligung: Bei Bewilligung und Zahlungseingang stellen wir 10 % in Rechnung.",
      },
      {
        question: "Kann ich die Zusammenarbeit jederzeit beenden?",
        answer:
          "Ja. Es gibt keine Mindestlaufzeit und keine Kündigungsfristen. Sie können die Zusammenarbeit jederzeit beenden — ohne Kosten, ohne Begründung. Laufende Anträge, die bereits eingereicht wurden, werden noch abgeschlossen; für diese gilt weiterhin das Erfolgshonorar-Modell.",
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap(({ items }) =>
    items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Häufige Fragen
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          Ihre Fragen zu Foerderis
        </h1>
        <p className="mb-16 text-lg text-muted-foreground">
          Klare Antworten — ohne Marketingsprache.
        </p>

        <div className="space-y-12">
          {FAQ_CATEGORIES.map(({ title, items }) => (
            <section key={title} aria-labelledby={`cat-${title}`}>
              <h2
                id={`cat-${title}`}
                className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {title}
              </h2>
              <div className="divide-y divide-border rounded-xl border border-border">
                {items.map(({ question, answer }) => (
                  <details
                    key={question}
                    className="group px-6 py-4 [&[open]>summary>svg]:rotate-180"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground marker:hidden">
                      {question}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-muted-foreground transition-transform duration-200"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-secondary/30 p-8 text-center">
          <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">
            Noch eine Frage?
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Wir antworten innerhalb von zwei Werktagen.
          </p>
          <Button asChild>
            <Link href="/#kontakt">Unverbindlich anfragen</Link>
          </Button>
        </div>

        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/">← Zurück zur Startseite</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
