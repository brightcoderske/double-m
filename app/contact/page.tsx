import { PublicPage } from "../components/public-page";
export const metadata = { title: "Contact Double M Agency" };
export default function Contact() {
  return (
    <PublicPage
      eyebrow="Contact us"
      title="Speak with a real person."
      intro="Ask about a role, a staffing need or an ongoing placement. Official phone, WhatsApp, office and business-hour details are controlled from the secure administration workspace."
    >
      <section className="contact-grid shell">
        <article>
          <span>Email</span>
          <h2>hello@doublemagency.co.ke</h2>
          <p>For recruitment enquiries and account support.</p>
        </article>
        <article>
          <span>Phone & WhatsApp</span>
          <h2>Awaiting agency confirmation</h2>
          <p>
            The verified number will appear here once saved by the
            administrator.
          </p>
        </article>
        <article>
          <span>Office</span>
          <h2>Kenya</h2>
          <p>
            The verified office address, map and directions will appear here
            once approved.
          </p>
        </article>
        <article>
          <span>Hours</span>
          <h2>Monday–Friday</h2>
          <p>
            8:00 AM–5:00 PM. Final hours are configurable by the administrator.
          </p>
        </article>
      </section>
    </PublicPage>
  );
}
