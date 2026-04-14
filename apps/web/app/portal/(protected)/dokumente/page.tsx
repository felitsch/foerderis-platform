import type { Document } from "@foerderis/db";
import { getAuthenticatedCustomer, getCustomerDocuments } from "../queries";

const CATEGORY_LABELS: Record<Document["category"], string> = {
  antrag: "Antrag",
  checkliste: "Checkliste",
  bescheid: "Bescheid",
  sonstige: "Sonstige",
};

const CATEGORY_COLORS: Record<Document["category"], string> = {
  antrag: "bg-blue-100 text-blue-700",
  checkliste: "bg-amber-100 text-amber-700",
  bescheid: "bg-green-100 text-green-700",
  sonstige: "bg-slate-100 text-slate-700",
};

export default async function DokumentePage() {
  const customer = await getAuthenticatedCustomer();

  if (!customer) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dokumente</h1>
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          Ihr Kundenprofil wird gerade eingerichtet.
        </div>
      </div>
    );
  }

  const documents = await getCustomerDocuments(customer.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ihre Dokumente</h1>
        <p className="text-muted-foreground mt-1">
          Hier finden Sie alle Unterlagen zu Ihren Förderanträgen.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          Noch keine Dokumente vorhanden.
          <br />
          Sobald Unterlagen für Sie bereitstehen, erscheinen sie hier.
        </div>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.createdAt.toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[doc.category]}`}
              >
                {CATEGORY_LABELS[doc.category]}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
