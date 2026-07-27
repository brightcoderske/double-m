import type { Metadata } from "next";
import { AvailableCandidateRail } from "../components/available-candidate-rail";
import { ShareButton } from "../components/share-button";
import { SimpleHeader } from "../components/simple-header";

export const metadata: Metadata = {
  title: "Available Househelps, Nannies and Caregivers",
  description:
    "Explore agency-approved profiles of househelps, nannies, caregivers and practical staff available through Double M Agency.",
};

export default function TalentPage() {
  return (
    <>
      <SimpleHeader />
      <main className="talent-page shell">
        <section className="talent-page-heading">
          <span>Available talent</span>
          <h1>Meet workers ready for a suitable placement.</h1>
          <p>
            Browse concise public profiles. Double M keeps identity documents
            and sensitive personal information private.
          </p>
          <ShareButton
            title="Available workers at Double M Agency"
            url="/talent"
            label="Share available workers"
            text="View available househelps, nannies, caregivers and practical staff through Double M Agency."
          />
        </section>
        <AvailableCandidateRail />
      </main>
    </>
  );
}
