import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foerderis — Fördermittelberatung auf Erfolgsbasis",
  description:
    "Wir werden nur bezahlt, wenn Sie gefördert werden. Ein KI-Team sucht rund um die Uhr Förderprogramme für den deutschen Mittelstand — 10 % nur bei Bewilligung.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
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
