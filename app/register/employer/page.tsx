import { EmployerAccountForm } from "../../components/employer-account-form";
import { SimpleHeader } from "../../components/simple-header";
import { GoogleSignIn } from "../../components/google-sign-in";
export const metadata = { title: "Employer registration" };
export default function Page() {
  return (
    <>
      <SimpleHeader />
      <main className="form-page">
        <section className="form-intro">
          <span>Employer workspace</span>
          <h1>Recruit, follow up and stay supported.</h1>
          <p>
            Create your secure workspace to track staffing requests, placements,
            payments, replacements and contract extensions.
          </p>
        </section>
        <section className="form-panel">
          <h2>Create employer account</h2>
          <EmployerAccountForm />
          <GoogleSignIn role="employer" />
        </section>
      </main>
    </>
  );
}
