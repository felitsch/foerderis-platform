import { Button } from "@foerderis/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Foerderis",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Datenschutzerklärung
      </h1>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Verantwortlicher</h2>
          <p className="mt-2">
            Verantwortlicher im Sinne der DSGVO:
            <br />
            <br />
            Felix Gaber
            <br />
            Software und KI Produkte
            <br />
            Baumreute 55
            <br />
            70199 Stuttgart
            <br />
            Deutschland
            <br />
            <br />
            E-Mail:{" "}
            <a href="mailto:kontakt@foerderis.de" className="text-foreground hover:underline">
              kontakt@foerderis.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Hosting</h2>
          <p className="mt-2">
            Diese Website wird gehostet bei Vercel Inc., 340 Pine Street, Suite 701, San Francisco,
            CA 94104, USA. Vercel stellt die technische Infrastruktur bereit. Die Server, über die
            diese Website ausgeliefert wird, befinden sich in der Region EU (Frankfurt/Deutschland).
          </p>
          <p className="mt-2">
            Beim Aufruf der Website werden durch den Hosting-Anbieter automatisch sog.
            Server-Log-Dateien erfasst, die Ihr Browser übermittelt. Dies sind:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Browsertyp und -version</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse (anonymisiert)</li>
          </ul>
          <p className="mt-2">
            Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Erfassung dieser
            Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            einem sicheren und störungsfreien Betrieb der Website).
          </p>
          <p className="mt-2">
            Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Weitere Informationen
            finden Sie in der{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Datenschutzerklärung von Vercel
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Kontaktformular / Warteliste</h2>
          <p className="mt-2">
            Wenn Sie sich über unser Formular in die Warteliste eintragen, erheben wir Ihre
            E-Mail-Adresse sowie die optionalen Angaben, die Sie im Formular machen
            (Unternehmensname, Mitarbeiterzahl, Nachricht).
          </p>
          <p className="mt-2">Diese Daten verwenden wir ausschließlich, um:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Ihre Anfrage zu bearbeiten und Sie zu kontaktieren</li>
            <li>zu prüfen, ob Foerderis zu Ihrem Unternehmen passt</li>
          </ul>
          <p className="mt-2">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie Art. 6
            Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen).
          </p>
          <p className="mt-2">
            Ihre Daten werden nicht an Dritte weitergegeben und nicht für Werbezwecke genutzt. Sie
            werden gelöscht, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Keine Tracking-Tools</h2>
          <p className="mt-2">
            Diese Website verwendet <strong className="text-foreground">kein</strong> Google
            Analytics, kein Facebook Pixel und keine sonstigen Analyse- oder Tracking-Dienste. Es
            werden keine Cookies für Werbung oder Reichweitenmessung gesetzt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Schriften und externe Ressourcen
          </h2>
          <p className="mt-2">
            Diese Website lädt keine Schriften von externen Servern (z. B. Google Fonts CDN).
            Sämtliche verwendeten Schriften sind Systemschriften des Betriebssystems oder werden
            lokal ausgeliefert. Es werden dadurch keine Verbindungen zu Drittservern aufgebaut.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Ihre Rechte</h2>
          <p className="mt-2">
            Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden
            personenbezogenen Daten:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-2">
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
            <a href="mailto:kontakt@foerderis.de" className="text-foreground hover:underline">
              kontakt@foerderis.de
            </a>
          </p>
          <p className="mt-2">
            Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
            Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Die zuständige
            Aufsichtsbehörde in Baden-Württemberg ist der{" "}
            <a
              href="https://www.baden-wuerttemberg.datenschutz.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Landesbeauftragte für Datenschutz und Informationsfreiheit Baden-Württemberg
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Aktualität dieser Erklärung</h2>
          <p className="mt-2">
            Diese Datenschutzerklärung ist aktuell gültig und hat den Stand April 2026. Durch
            Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw.
            behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/">← Zurück zur Startseite</Link>
        </Button>
      </div>
    </main>
  );
}
