import { SimpleHeader } from "../components/simple-header";
import { JobBrowser } from "../components/job-browser";
export const metadata = {
  title: "Verified jobs in Kenya",
  description: "Browse genuine opportunities published by Double M Agency.",
};
export default function Jobs() {
  return (
    <>
      <SimpleHeader />
      <main className="list-page shell">
        <span className="kicker">Verified opportunities</span>
        <h1>Find your next role.</h1>
        <JobBrowser />
      </main>
    </>
  );
}
