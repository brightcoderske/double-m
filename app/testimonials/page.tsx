import { PublicPage } from "../components/public-page";
export const metadata = { title: "Client and candidate experiences" };
export default function Testimonials() {
  return (
    <PublicPage
      eyebrow="Experiences"
      title="Trust is earned through the work."
      intro="Only approved, permission-based reviews from employers and placed candidates are published here."
    >
      <section className="honest-empty shell">
        <h2>Verified experiences will appear here.</h2>
        <p>
          We have intentionally left this page free of fabricated reviews.
          Returning clients and candidates can submit feedback from their
          private workspace; the agency reviews consent before publication.
        </p>
      </section>
    </PublicPage>
  );
}
