"use client";

import { useRef, useState } from "react";
import { uploadDocument } from "./actions";

export function UploadForm() {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("uploading");
    setMessage("");

    const result = await uploadDocument(formData);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Dokument erfolgreich hochgeladen.");
      formRef.current?.reset();
      // Reload to show the new document in the list
      window.location.reload();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="file"
          name="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          required
          className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground file:transition-colors hover:file:bg-muted/80"
        />
        <button
          type="submit"
          disabled={status === "uploading"}
          className="rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "uploading" ? "Wird hochgeladen…" : "Hochladen"}
        </button>
      </div>
      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
