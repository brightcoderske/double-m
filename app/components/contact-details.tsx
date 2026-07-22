"use client";
import { useEffect, useState } from "react";
type Settings = {
  contact_phone?: string;
  contact_email?: string;
  office_address?: string;
  business_hours?: string;
  map_url?: string;
};
export function ContactDetails() {
  const [settings, setSettings] = useState<Settings>({
    contact_email: "support@doublemagency.co.ke",
    office_address: "Kahawa West, Nairobi",
    business_hours: "Monday to Friday, 8:00 AM to 5:00 PM",
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/public`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : { settings: {} }))
      .then((x) => setSettings((current) => ({ ...current, ...x.settings })))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const phone = settings.contact_phone?.trim();
  const digits = phone?.replace(/\D/g, "") || "";
  const whatsappNumber = digits.startsWith("0")
    ? `254${digits.slice(1)}`
    : digits;
  return (
    <section className="contact-grid shell">
      <article>
        <span>Email</span>
        <h2>
          <a href={`mailto:${settings.contact_email}`}>
            {settings.contact_email}
          </a>
        </h2>
        <p>For recruitment enquiries and account support.</p>
      </article>
      <article>
        <span>Phone & WhatsApp</span>
        <h2>{phone ? <a href={`tel:${phone}`}>{phone}</a> : "0792613346"}</h2>
        <p>
          {phone ? (
            <a href={`https://wa.me/${whatsappNumber}`}>
              Start a WhatsApp conversation
            </a>
          ) : (
            <a href="https://wa.me/254792613346">
              Start a WhatsApp conversation
            </a>
          )}
        </p>
      </article>
      <article>
        <span>Office</span>
        <h2>
          {settings.map_url ? (
            <a href={settings.map_url} target="_blank" rel="noreferrer">
              {settings.office_address || "Kahawa West, Nairobi"}
            </a>
          ) : (
            settings.office_address || "Kahawa West, Nairobi"
          )}
        </h2>
        <p>Visits are confirmed with the agency before arrival.</p>
      </article>
      <article>
        <span>Hours</span>
        <h2>{settings.business_hours || "Contact the agency"}</h2>
        <p>
          Messages received outside these hours are handled on the next working
          day.
        </p>
      </article>
    </section>
  );
}
