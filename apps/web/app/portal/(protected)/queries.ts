import { auth, customer, db, document, eq, lead } from "@foerderis/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Get the authenticated customer record. Redirects to login if not authenticated.
 */
export async function getAuthenticatedCustomer() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/portal/login");

  const rows = await db
    .select()
    .from(customer)
    .where(eq(customer.userId, session.user.id))
    .limit(1);

  return rows[0] ?? null;
}

/**
 * Get all leads for a customer.
 */
export async function getCustomerLeads(customerId: string) {
  return db.select().from(lead).where(eq(lead.customerId, customerId)).orderBy(lead.lastActivityAt);
}

/**
 * Get all documents for a customer.
 */
export async function getCustomerDocuments(customerId: string) {
  return db
    .select()
    .from(document)
    .where(eq(document.customerId, customerId))
    .orderBy(document.createdAt);
}
