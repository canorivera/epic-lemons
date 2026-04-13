import { Founder, Mentor, MatchResult, Challenge, Industry, ExpertiseArea } from "./types";

// Weights for the matching score components
const WEIGHTS = {
  complementarity: 0.40,
  alignment: 0.30,
  availability: 0.15,
  style: 0.15,
};

/**
 * Compute Jaccard similarity between two sets represented as arrays.
 */
function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Compute how well a mentor's expertise fills a founder's needs.
 * This is the core signal: does the mentor have what the founder is looking for?
 */
function complementarityScore(founder: Founder, mentor: Mentor): number {
  const needs = new Set<ExpertiseArea>(founder.looking_for);
  const offers = new Set<ExpertiseArea>(mentor.expertise);

  if (needs.size === 0) return 0;

  // How many of the founder's needs does the mentor cover?
  let covered = 0;
  for (const need of needs) {
    if (offers.has(need)) covered++;
  }

  // Weight by position: first challenges are more important
  let weightedCovered = 0;
  let totalWeight = 0;
  founder.looking_for.forEach((need, index) => {
    const weight = 1 / (index + 1); // Rank weighting: 1, 0.5, 0.33, ...
    totalWeight += weight;
    if (offers.has(need)) weightedCovered += weight;
  });

  return totalWeight > 0 ? weightedCovered / totalWeight : 0;
}

/**
 * Compute alignment: industry overlap and stage preference match.
 */
function alignmentScore(founder: Founder, mentor: Mentor): number {
  // Industry match
  const industryMatch = mentor.industries.includes(founder.industry) ? 1.0 : 0.0;

  // Stage preference match
  const stageMatch = mentor.preferred_stages.includes(founder.stage) ? 1.0 : 0.0;

  // Business model overlap (mentors who've worked in the same industry tend to understand the model)
  const industryOverlap = jaccardSimilarity(
    [founder.industry],
    mentor.industries
  );

  return (industryMatch * 0.4 + stageMatch * 0.4 + industryOverlap * 0.2);
}

/**
 * Compute availability compatibility.
 */
function availabilityScore(founder: Founder, mentor: Mentor): number {
  // Check if mentor has capacity
  if (mentor.current_mentees >= mentor.max_mentees) return 0.1; // Not zero—they might free up

  const capacityRatio = 1 - (mentor.current_mentees / mentor.max_mentees);

  // Timezone compatibility (simplified: same continent = good)
  const founderContinent = founder.timezone.split("/")[0];
  const mentorContinent = mentor.timezone.split("/")[0];
  const tzScore = founderContinent === mentorContinent ? 1.0 : 0.5;

  // Meeting frequency alignment
  const freqMap = { weekly: 3, biweekly: 2, monthly: 1 };
  const founderFreq = freqMap[founder.meeting_frequency];
  const mentorFreq = freqMap[mentor.meeting_frequency];
  const freqScore = 1 - Math.abs(founderFreq - mentorFreq) / 2;

  return (capacityRatio * 0.4 + tzScore * 0.3 + freqScore * 0.3);
}

/**
 * Compute working style compatibility.
 */
function styleScore(founder: Founder, mentor: Mentor): number {
  if (founder.working_style === mentor.working_style) return 1.0;
  if (founder.working_style === "balanced" || mentor.working_style === "balanced") return 0.7;
  return 0.3; // Opposite styles
}

/**
 * Generate a human-readable reason for the match.
 */
function generateReason(founder: Founder, mentor: Mentor, breakdown: MatchResult["breakdown"]): string {
  const reasons: string[] = [];

  // Expertise match
  const matchedExpertise = founder.looking_for.filter((need) =>
    mentor.expertise.includes(need)
  );
  if (matchedExpertise.length > 0) {
    const labels = matchedExpertise.map((e) => e.replace(/-/g, " "));
    reasons.push(`Direct expertise in ${labels.join(", ")}`);
  }

  // Industry match
  if (mentor.industries.includes(founder.industry)) {
    reasons.push(`Deep experience in ${founder.industry.replace(/-/g, " ")}`);
  }

  // Stage match
  if (mentor.preferred_stages.includes(founder.stage)) {
    reasons.push(`Prefers working with ${founder.stage} stage startups`);
  }

  // Availability
  if (breakdown.availability > 0.7) {
    reasons.push("Great availability and timezone alignment");
  }

  // Social proof
  if (mentor.avg_rating >= 4.8) {
    reasons.push(`Highly rated mentor (${mentor.avg_rating}/5)`);
  }

  return reasons.slice(0, 3).join(". ") + ".";
}

/**
 * Main matching function: rank all mentors for a given founder.
 */
export function rankMentorsForFounder(founder: Founder, mentors: Mentor[]): MatchResult[] {
  const results: MatchResult[] = mentors.map((mentor) => {
    const breakdown = {
      complementarity: complementarityScore(founder, mentor),
      alignment: alignmentScore(founder, mentor),
      availability: availabilityScore(founder, mentor),
      style: styleScore(founder, mentor),
    };

    const score =
      WEIGHTS.complementarity * breakdown.complementarity +
      WEIGHTS.alignment * breakdown.alignment +
      WEIGHTS.availability * breakdown.availability +
      WEIGHTS.style * breakdown.style;

    return {
      mentor,
      score,
      breakdown,
      reason: generateReason(founder, mentor, breakdown),
    };
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Find top N matches for a founder.
 */
export function findTopMatches(
  founder: Founder,
  mentors: Mentor[],
  n: number = 5
): MatchResult[] {
  return rankMentorsForFounder(founder, mentors).slice(0, n);
}
