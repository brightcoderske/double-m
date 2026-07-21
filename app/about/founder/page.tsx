import { PublicPage } from "../../components/public-page";
export const metadata = { title: "Our founder" };
export default function Founder() {
  return (
    <PublicPage
      eyebrow="Leadership"
      title="A people-first standard from the top."
      intro="Double M Agency was shaped around a simple belief: recruitment should feel responsible, understandable and personal—not transactional."
    >
      <section className="prose shell">
        <h2>A note from our founder</h2>
        <p>
          Every staffing request affects a home, a livelihood or an
          organisation. That responsibility guides how we listen, screen,
          communicate and follow up. We are building an agency where employers
          can ask honest questions, candidates are treated with dignity, and
          staff are accountable for every recommendation.
        </p>
        <p>
          Founder profile details and an approved portrait can be published from
          the administration workspace once supplied by the agency.
        </p>
      </section>
    </PublicPage>
  );
}
