import type { Lead } from "@foerderis/db";
import { getAuthenticatedCustomer, getCustomerLeads } from "../queries";

const STATUS_LABELS: Record<Lead["status"], string> = {
  initial: "Neu",
  in_progress: "In Bearbeitung",
  submitted: "Eingereicht",
  approved: "Bewilligt",
  rejected: "Abgelehnt",
};

const STATUS_COLORS: Record<Lead["status"], string> = {
  initial: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  submitted: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const customer = await getAuthenticatedCustomer();

  if (!customer) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Ihr Dashboard</h1>
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          Ihr Kundenprofil wird gerade eingerichtet. Bitte haben Sie einen Moment Geduld.
        </div>
      </div>
    );
  }

  const leads = await getCustomerLeads(customer.id);

  const counts = {
    in_progress: leads.filter((l) => l.status === "in_progress").length,
    submitted: leads.filter((l) => l.status === "submitted").length,
    approved: leads.filter((l) => l.status === "approved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ihr Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Willkommen, {customer.companyName}. Hier sehen Sie den aktuellen Status Ihrer
          Förderanträge.
        </p>
      </div>

      {/* Status-Karten */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard label="In Bearbeitung" value={String(counts.in_progress)} />
        <StatusCard label="Eingereicht" value={String(counts.submitted)} />
        <StatusCard label="Bewilligt" value={String(counts.approved)} />
      </div>

      {/* Anträge-Tabelle */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Meine Förderanträge</h2>
        {leads.length === 0 ? (
          <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
            Noch keine Förderanträge vorhanden.
            <br />
            Ihr Foerderis-Team meldet sich, sobald passende Programme gefunden wurden.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Förderprogramm
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Letzte Aktivität
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-foreground">{l.foerderprogrammName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[l.status]}`}
                      >
                        {STATUS_LABELS[l.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {l.lastActivityAt.toLocaleDateString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
