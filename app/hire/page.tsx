import { PublicForm } from "../components/public-form";
import { SimpleHeader } from "../components/simple-header";
export const metadata = { title: "Request staff" };
export default function Hire() {
  return (
    <>
      <SimpleHeader />
      <main className="form-page">
        <section className="form-intro">
          <span>Staffing request</span>
          <h1>Tell us who would make the difference.</h1>
          <p>
            You do not need an account to begin. Share the role and our team
            will clarify the requirements before any candidate is introduced.
          </p>
        </section>
        <section className="form-panel">
          <h2>Request a worker</h2>
          <p>Only necessary details are collected at this stage.</p>
          <PublicForm kind="employer" />
        </section>
      </main>
    </>
  );
}
