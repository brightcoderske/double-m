"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReceiptPage() {
  const { receiptNumber } = useParams<{ receiptNumber: string }>();
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/${receiptNumber}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).message);
        return response.json();
      })
      .then((data) => setReceipt(data.receipt))
      .catch(
        (reason) => reason.name !== "AbortError" && setError(reason.message),
      );
    return () => controller.abort();
  }, [receiptNumber]);
  if (error)
    return (
      <main className="receipt-page">
        <p>{error}</p>
        <Link href="/dashboard">Return to dashboard</Link>
      </main>
    );
  if (!receipt)
    return (
      <main className="receipt-page">
        <p>Preparing your receipt…</p>
      </main>
    );
  return (
    <main className="receipt-page">
      <div className="receipt-actions">
        <Link href="/dashboard">← Dashboard</Link>
        <button onClick={() => window.print()}>Print receipt</button>
      </div>
      <article className="receipt-card">
        <header>
          <div>
            <strong>DOUBLE M AGENCY</strong>
            <small>Recruitment & placement services</small>
          </div>
          <span>PAID</span>
        </header>
        <section>
          <small>OFFICIAL RECEIPT</small>
          <h1>{receipt.receipt_number}</h1>
          <p>Issued {new Date(receipt.issued_at).toLocaleString()}</p>
        </section>
        <dl>
          <div>
            <dt>Received from</dt>
            <dd>{receipt.email}</dd>
          </div>
          <div>
            <dt>For</dt>
            <dd>{receipt.purpose}</dd>
          </div>
          <div>
            <dt>Payment reference</dt>
            <dd>{receipt.reference_code}</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>
              {receipt.method_code?.replaceAll("_", " ") || "Recorded payment"}
            </dd>
          </div>
          <div>
            <dt>External reference</dt>
            <dd>{receipt.external_reference || "—"}</dd>
          </div>
        </dl>
        <div className="receipt-total">
          <span>Amount paid</span>
          <strong>
            {receipt.currency} {Number(receipt.amount).toLocaleString()}
          </strong>
        </div>
        <footer>
          This system receipt is tied to a verified payment record. Please quote
          the receipt number when contacting Double M Agency.
        </footer>
      </article>
    </main>
  );
}
