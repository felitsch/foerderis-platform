import { getAuthenticatedCustomer, getCustomerLeads } from "../queries";

/**
 * Static catalogue of common German funding programmes.
 * Will be replaced with dynamic data from the Förderdatenbank (FRDAA-53) later.
 */
const FOERDERPROGRAMME = [
  {
    id: "zim",
    name: "ZIM – Zentrales Innovationsprogramm Mittelstand",
    foerdergeber: "BMWK",
    maxFoerderung: "bis zu 380.000 €",
    zielgruppe: "KMU mit innovativen F&E-Projekten",
    laufzeit: "bis 36 Monate",
  },
  {
    id: "kmu-innovativ",
    name: "KMU-innovativ",
    foerdergeber: "BMBF",
    maxFoerderung: "bis zu 50 % der Projektkosten",
    zielgruppe: "KMU in Spitzentechnologien",
    laufzeit: "bis 36 Monate",
  },
  {
    id: "ibb-pro-fit",
    name: "IBB Pro FIT",
    foerdergeber: "IBB Berlin",
    maxFoerderung: "bis zu 400.000 €",
    zielgruppe: "Berliner Unternehmen mit innovativen Produkten",
    laufzeit: "bis 24 Monate",
  },
  {
    id: "go-inno",
    name: "go-inno – Innovationsgutscheine",
    foerdergeber: "BMWK",
    maxFoerderung: "bis zu 20.000 €",
    zielgruppe: "KMU, die externe Beratung für Innovationen benötigen",
    laufzeit: "bis 12 Monate",
  },
  {
    id: "digital-jetzt",
    name: "Digital Jetzt",
    foerdergeber: "BMWK",
    maxFoerderung: "bis zu 50.000 €",
    zielgruppe: "KMU mit Digitalisierungsprojekten",
    laufzeit: "bis 12 Monate",
  },
  {
    id: "eic-accelerator",
    name: "EIC Accelerator",
    foerdergeber: "EU",
    maxFoerderung: "bis zu 2,5 Mio. €",
    zielgruppe: "High-Impact-Innovationen mit Skalierungspotenzial",
    laufzeit: "bis 24 Monate",
  },
];

type MatchLevel = "hoch" | "mittel" | "prüfenswert";

const MATCH_COLORS: Record<MatchLevel, string> = {
  hoch: "bg-green-100 text-green-700",
  mittel: "bg-amber-100 text-amber-700",
  prüfenswert: "bg-slate-100 text-slate-700",
};

export default async function FoerderprogrammePage() {
  const customer = await getAuthenticatedCustomer();

  if (!customer) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Passende Förderprogramme</h1>
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          Ihr Kundenprofil wird gerade eingerichtet.
        </div>
      </div>
    );
  }

  const leads = await getCustomerLeads(customer.id);
  const activePrograms = new Set(leads.map((l) => l.foerderprogrammName));

  // Simple static matching: programmes already linked to leads get "hoch",
  // the rest are shown as suggestions. In a future version this will use
  // real matching logic based on company profile and Förderdatenbank data.
  const matches = FOERDERPROGRAMME.map((p, i) => {
    let matchLevel: MatchLevel;
    if (activePrograms.has(p.name)) {
      matchLevel = "hoch";
    } else if (i < 3) {
      matchLevel = "mittel";
    } else {
      matchLevel = "prüfenswert";
    }
    return { ...p, matchLevel };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Passende Förderprogramme</h1>
        <p className="text-muted-foreground mt-1">
          Basierend auf Ihrem Unternehmensprofil — Ihr Foerderis-Team prüft die Eignung im Detail.
        </p>
      </div>

      <div className="grid gap-4">
        {matches.map((p) => (
          <div key={p.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-semibold text-foreground">{p.name}</h2>
                <p className="text-sm text-muted-foreground">{p.zielgruppe}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${MATCH_COLORS[p.matchLevel]}`}
              >
                Relevanz: {p.matchLevel}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span>Fördergeber: {p.foerdergeber}</span>
              <span>Max. Förderung: {p.maxFoerderung}</span>
              <span>Laufzeit: {p.laufzeit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Sie vermissen ein Programm? Sprechen Sie uns an — wir prüfen weitere Optionen für Sie.
      </div>
    </div>
  );
}
