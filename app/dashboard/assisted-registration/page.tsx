"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
export default function Assisted() {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("candidate");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Creating the account…");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/assisted-registration`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      ),
      b = await r.json();
    setMessage(
      r.ok
        ? b.message
        : b.issues?.map((issue: { message: string }) => issue.message).join(" ")
          || b.message
          || "The account could not be created.",
    );
  }
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard">← Staff workspace</Link>
        <span>Assisted registration</span>
        <h1>Register someone in the office.</h1>
        <p>
          Choose the correct role. The person receives a welcome message and
          must change the temporary password.
        </p>
      </header>
      <div className="admin-grid">
        <form onSubmit={submit}>
          <h2>Account and profile</h2>
          <label>
            Register as
            <select
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="candidate">Candidate seeking work</option>
              <option value="employer">Employer hiring staff</option>
            </select>
          </label>
          <label>
            Full name
            <input name="fullName" required />
          </label>
          <label>
            Email (optional)
            <input name="email" type="email" />
            <small>
              Leave blank when the client has no email. An agency login will be
              generated.
            </small>
          </label>
          <label>
            Phone
            <input
              name="phone"
              inputMode="numeric"
              pattern="0[0-9]{9}"
              maxLength={10}
              placeholder="0712345678"
              required
            />
          </label>
          <label>
            County or town
            <input name="location" required />
          </label>
          {role === "candidate" && (
            <>
              <label>
                Main profession
                <input name="profession" placeholder="For example: caregiver" />
              </label>
              <label>
                Year and date of birth
                <input
                  name="dateOfBirth"
                  type="date"
                  max={new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18),
                  )
                    .toISOString()
                    .slice(0, 10)}
                  required
                />
                <small>Candidate must be at least 18 years old.</small>
              </label>
              <label>
                Education level
                <input
                  name="educationLevel"
                  placeholder="For example: secondary school"
                />
              </label>
              <label>
                Home county
                <input name="county" placeholder="For example: Kakamega" />
              </label>
              <label>
                Languages
                <input
                  name="languages"
                  placeholder="For example: English, Kiswahili"
                />
              </label>
              <label>
                Work experience
                <input
                  name="experienceSummary"
                  placeholder="For example: 2 years in childcare"
                />
              </label>
              <label>
                Strongest skills
                <input
                  name="skillsSummary"
                  placeholder="For example: childcare, cooking, housekeeping"
                />
              </label>
            </>
          )}
          <label>
            Temporary password
            <input
              name="temporaryPassword"
              type="password"
              minLength={10}
              required
            />
          </label>
          <button>Create the correct account and send welcome email</button>
        </form>
      </div>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
