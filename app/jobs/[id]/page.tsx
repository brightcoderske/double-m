import { BriefcaseBusiness, MapPin, WalletCards } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "../../components/share-button";
import { SimpleHeader } from "../../components/simple-header";

type Job = {
  id: number;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  duties?: string;
  expectations?: string;
  experience_required?: string;
  salary_min?: number;
  salary_max?: number;
  schedule?: string;
  work_arrangement?: string;
  accommodation?: string;
  benefits?: string;
  application_deadline?: string;
};

async function getJob(id: string): Promise<Job | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/jobs/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;
  return (await response.json()).job;
}

export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  return (
    <>
      <SimpleHeader />
      <main className="job-detail-page shell">
        <Link href="/jobs">← All available jobs</Link>
        <header>
          <span className="kicker">Verified opportunity</span>
          <h1>{job.title}</h1>
          <div className="job-detail-facts">
            <span>
              <MapPin /> {job.location}
            </span>
            <span>
              <BriefcaseBusiness /> {job.employment_type}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span>
                <WalletCards /> KES{" "}
                {Number(job.salary_min || 0).toLocaleString()}–
                {Number(job.salary_max || 0).toLocaleString()}
              </span>
            )}
          </div>
          <div className="job-detail-actions">
            <Link className="button dark" href="/login">
              Sign in to apply
            </Link>
            <ShareButton
              title={job.title}
              label="Share job"
              text={`${job.title} opportunity in ${job.location} through Double M Agency.`}
            />
          </div>
        </header>
        <section className="job-detail-content">
          <article>
            <h2>About the role</h2>
            <p>{job.description}</p>
          </article>
          {job.duties && (
            <article>
              <h2>Responsibilities</h2>
              <p>{job.duties}</p>
            </article>
          )}
          {job.expectations && (
            <article>
              <h2>What the employer expects</h2>
              <p>{job.expectations}</p>
            </article>
          )}
          <aside>
            {job.experience_required && (
              <p>
                <b>Experience</b>
                {job.experience_required}
              </p>
            )}
            {job.schedule && (
              <p>
                <b>Schedule</b>
                {job.schedule}
              </p>
            )}
            {job.work_arrangement && (
              <p>
                <b>Arrangement</b>
                {job.work_arrangement.replaceAll("_", " ")}
              </p>
            )}
            {job.application_deadline && (
              <p>
                <b>Apply by</b>
                {new Date(job.application_deadline).toLocaleDateString("en-KE")}
              </p>
            )}
          </aside>
        </section>
      </main>
    </>
  );
}
