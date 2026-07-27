"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

const api = process.env.NEXT_PUBLIC_API_URL;

export default function AccountEditor() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(`${api}/admin/users/${id}/profile`, {
      credentials: "include",
    });
    const body = await response.json();
    if (response.ok) setData(body);
    else setMessage(body.message);
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form);
    const response = await fetch(`${api}/admin/users/${id}/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        publicProfileConsent: form.get("publicProfileConsent") === "on",
      }),
    });
    const result = await response.json();
    setMessage(result.message);
    if (response.ok) await load();
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`${api}/staff/candidates/${id}/documents`, {
      method: "POST",
      credentials: "include",
      body: new FormData(event.currentTarget),
    });
    const result = await response.json();
    setMessage(result.message);
    if (response.ok) {
      event.currentTarget.reset();
      await load();
    }
  }

  if (!data)
    return (
      <main className="admin-controls">
        <p>{message || "Loading account…"}</p>
      </main>
    );

  const account = data.account;
  const candidate = account.role === "candidate";
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard/admin/users">← Account management</Link>
        <span>{account.role.replaceAll("_", " ")}</span>
        <h1>{account.full_name}</h1>
      </header>
      <section className="dash-panel">
        <form className="profile-editor-grid" onSubmit={save}>
          <label>
            Full name
            <input name="fullName" defaultValue={account.full_name} required />
          </label>
          <label>
            Email
            <input name="email" type="email" defaultValue={account.email} required />
          </label>
          <label>
            Phone
            <input name="phone" defaultValue={account.phone} />
          </label>
          {candidate && (
            <>
              <label>
                Main role
                <input name="profession" defaultValue={account.profession} />
              </label>
              <label>
                Current location
                <input name="location" defaultValue={account.location} />
              </label>
              <label>
                Availability
                <select name="availabilityStatus" defaultValue={account.availability_status}>
                  <option value="available">Available now</option>
                  <option value="available_from">Available from a date</option>
                  <option value="placed">Placed</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </label>
              <label>
                Date of birth
                <input name="dateOfBirth" type="date" defaultValue={account.date_of_birth?.slice(0, 10)} />
              </label>
              <label>
                Education
                <input name="educationLevel" defaultValue={account.education_level} />
              </label>
              <label>
                Home county
                <input name="county" defaultValue={account.county} />
              </label>
              <label>
                Languages
                <input name="languages" defaultValue={account.languages} />
              </label>
              <label>
                Experience
                <input name="experienceSummary" defaultValue={account.experience_summary} />
              </label>
              <label className="field-span">
                Strongest skills
                <textarea name="skillsSummary" defaultValue={account.skills_summary} rows={3} />
              </label>
              <label>
                Best role
                <input name="bestRole" defaultValue={account.best_role} />
              </label>
              <label>
                Other suitable roles
                <input name="otherRoles" defaultValue={account.other_roles} />
              </label>
              <label>
                Preferred location
                <input name="preferredLocation" defaultValue={account.preferred_location} />
              </label>
              <label>
                Work arrangement
                <select name="workArrangement" defaultValue={account.work_arrangement || "either"}>
                  <option value="live_in">Live in</option>
                  <option value="live_out">Live out</option>
                  <option value="either">Either</option>
                </select>
              </label>
              <label>
                Employment type
                <select name="employmentType" defaultValue={account.employment_type || "any"}>
                  <option value="full_time">Full time</option>
                  <option value="part_time">Part time</option>
                  <option value="contract">Contract</option>
                  <option value="any">Any</option>
                </select>
              </label>
              <label>
                Available from
                <input name="availableFrom" type="date" defaultValue={account.available_from?.slice(0, 10)} />
              </label>
              <label className="consent-field field-span">
                <input
                  name="publicProfileConsent"
                  type="checkbox"
                  defaultChecked={Boolean(account.public_profile_consent)}
                />
                Candidate has agreed that their approved photo and profile summary may appear publicly.
              </label>
            </>
          )}
          <div className="field-span">
            <button className="button dark">Save account details</button>
          </div>
        </form>
      </section>
      {candidate && (
        <section className="dash-panel">
          <div className="panel-heading">
            <div>
              <span>Private records</span>
              <h2>Documents and passport photo</h2>
            </div>
          </div>
          <form className="document-upload" onSubmit={upload}>
            <select name="documentType" aria-label="Document type">
              <option value="passport_photo">Passport-sized photo</option>
              <option value="national_id">National ID</option>
              <option value="cv">CV</option>
              <option value="certificate">Certificate</option>
              <option value="recommendation">Recommendation</option>
              <option value="police_clearance">Police clearance</option>
              <option value="driving_licence">Driving licence</option>
            </select>
            <input name="document" type="file" accept="application/pdf,image/jpeg,image/png" required />
            <button>Upload or replace</button>
          </form>
          <div className="simple-rows">
            {data.documents.map((document: any) => (
              <div key={document.id}>
                <b>{document.document_type.replaceAll("_", " ")}</b>
                <span>{document.status.replaceAll("_", " ")}</span>
                <a href={`${api}/documents/${document.id}/preview`} target="_blank" rel="noreferrer">
                  Preview
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
