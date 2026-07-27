"use client";

import { FormEvent, useState } from "react";
import { Send, X } from "lucide-react";

type RequestDocumentsDialogProps = {
  candidateName: string;
  onClose: () => void;
  onSend: (note: string) => Promise<void>;
};

export function RequestDocumentsDialog({
  candidateName,
  onClose,
  onSend,
}: RequestDocumentsDialogProps) {
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const note = String(new FormData(event.currentTarget).get("note") || "");
    setBusy(true);
    try {
      await onSend(note);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="request-documents-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-documents-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>Candidate follow-up</span>
            <h2 id="request-documents-title">Request documents</h2>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X />
          </button>
        </header>
        <form onSubmit={submit}>
          <p>
            Send <b>{candidateName}</b> a clear note about what needs to be
            uploaded, replaced or corrected.
          </p>
          <label>
            Message to candidate
            <textarea
              name="note"
              minLength={10}
              maxLength={500}
              rows={5}
              placeholder="For example: Please upload a clear photo of both sides of your National ID."
              required
              autoFocus
            />
            <small>This message will appear in their portal and email.</small>
          </label>
          <footer>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button dark" disabled={busy}>
              <Send /> {busy ? "Sending…" : "Send request"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
