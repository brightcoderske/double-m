const roleTerms = {
  caregiver: [
    "caregiver",
    "elderly",
    "senior care",
    "wheelchair",
    "companionship",
  ],
  nanny: ["nanny", "childcare", "child care", "baby", "children"],
  househelp: [
    "househelp",
    "house help",
    "domestic",
    "cleaning",
    "laundry",
    "washing dishes",
  ],
  driver: ["driver", "driving", "license", "licence"],
  cook: ["cook", "chef", "cooking", "meals"],
  gardener: ["gardener", "garden", "shamba", "farm worker"],
};
export function understand(text = "") {
  const clean = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    roles = Object.entries(roleTerms)
      .filter(([, terms]) => terms.some((t) => clean.includes(t)))
      .map(([role]) => role);
  return {
    clean,
    roles,
    tokens: [...new Set(clean.split(" ").filter((x) => x.length > 2))],
  };
}
export function scoreCandidate(request, candidate, preferences = {}) {
  const need = understand(
      `${request.role_needed || request.title || ""} ${request.requirements || request.duties || ""} ${request.expectations || ""}`,
    ),
    profile = understand(
      `${candidate.profession || ""} ${preferences.best_role || ""} ${preferences.other_roles || ""}`,
    );
  let score = 0;
  const reasons = [];
  if (need.roles.length && need.roles.some((r) => profile.roles.includes(r))) {
    score += 40;
    reasons.push("stated role experience aligns");
  } else if (need.tokens.some((t) => profile.tokens.includes(t))) {
    score += 18;
    reasons.push("profile contains related work language");
  }
  const requestedLocation = (request.location || "").toLowerCase(),
    candidateLocation = (
      preferences.preferred_location ||
      candidate.location ||
      ""
    ).toLowerCase();
  if (
    requestedLocation &&
    candidateLocation &&
    (requestedLocation.includes(candidateLocation) ||
      candidateLocation.includes(requestedLocation))
  ) {
    score += 15;
    reasons.push("preferred location aligns");
  }
  if (candidate.availability_status === "available") {
    score += 15;
    reasons.push("candidate is currently available");
  }
  const salaryMax = Number(request.salary_max || request.salary_budget || 0),
    expected = Number(preferences.expected_salary || 0);
  if (salaryMax && expected && expected <= salaryMax) {
    score += 15;
    reasons.push("salary expectation is within range");
  }
  if (
    request.work_arrangement &&
    preferences.work_arrangement &&
    (request.work_arrangement === preferences.work_arrangement ||
      preferences.work_arrangement === "either" ||
      request.work_arrangement === "either")
  ) {
    score += 10;
    reasons.push("live-in/live-out preference aligns");
  }
  const overlap = need.tokens.filter((t) => profile.tokens.includes(t)).length;
  if (overlap) {
    score += Math.min(5, overlap);
    reasons.push("stated skills overlap with duties");
  }
  return {
    score: Math.min(100, score),
    level:
      score >= 75
        ? "Strong match"
        : score >= 45
          ? "Possible match"
          : "Low match",
    reasons,
    reviewRequired: true,
  };
}
export const matchingPolicy = {
  used: [
    "role and stated skills",
    "general location",
    "availability",
    "salary compatibility",
    "work arrangement",
    "verified qualifications",
  ],
  excluded: [
    "tribe or ethnic origin",
    "parenthood or family status",
    "raw age unless a documented lawful occupational requirement exists",
    "unverified claims",
  ],
  principle:
    "The score recommends; agency staff verify facts and decide what may be shared.",
};
