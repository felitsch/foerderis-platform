"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { db, document } from "@foerderis/db";
import { getAuthenticatedCustomer } from "../queries";

const UPLOAD_DIR = join(process.cwd(), "uploads", "dokumente");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function uploadDocument(formData: FormData) {
  const customer = await getAuthenticatedCustomer();
  if (!customer) {
    return { error: "Nicht authentifiziert." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Bitte wählen Sie eine Datei aus." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Die Datei darf maximal 10 MB groß sein." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Nur PDF, PNG, JPG und Word-Dateien sind erlaubt." };
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${timestamp}_${safeName}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filePath = join(UPLOAD_DIR, fileName);
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  const url = `/api/portal/dokumente/${fileName}`;

  await db.insert(document).values({
    customerId: customer.id,
    name: file.name,
    category: "sonstige",
    url,
  });

  return { success: true };
}
