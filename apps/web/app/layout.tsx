import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://foerderis.de";

const TITLE = "Foerderis — Erfolgsbasierte Fördermittelberatung";
const DESCRIPTION =
  "Wir werden nur bezahlt, wenn Sie gefördert werden. Ein KI-Team sucht rund um die Uhr Förderprogramme für den deutschen Mittelstand — 10 % nur bei Bewilligung.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Foerderis",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Foerderis",
  url: SITE_URL,
  description:
    "KI-gestützte Fördermittelberatung auf reiner Erfolgsbasis für den deutschen Mittelstand. 10 % Erfolgshonorar — nur bei bewilligter Förderung.",
  areaServed: "DE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Zum Inhalt springen
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
