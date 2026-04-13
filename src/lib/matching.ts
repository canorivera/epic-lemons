/**
 * Sophisticated Mentor-Founder Matching Algorithm
 *
 * This module implements a multi-layer matching system combining techniques
 * from Machine Learning, Information Retrieval, and Mechanism Design:
 *
 * 1. COSINE SIMILARITY on multi-hot profile vectors (ML)
 * 2. TF-IDF weighted text similarity on bios and skills (IR)
 * 3. Weighted composite scoring with rank-decay (Statistics)
 * 4. GALE-SHAPLEY Deferred Acceptance for stable matching (Economics, Nobel Prize 2012)
 *
 * The composite score S(i,j) for founder i and mentor j is:
 *
 *   S(i,j) = w₁·Complementarity(i,j) + w₂·Alignment(i,j) +
 *            w₃·Availability(i,j) + w₄·Style(i,j) + w₅·TextSim(i,j)
 *
 * Where:
 *   - Complementarity uses cosine similarity on needs/expertise vectors
 *   - Alignment uses Jaccard index on industry + stage sets
 *   - Availability combines capacity ratio, timezone overlap, and frequency match
 *   - Style uses exact/partial match scoring
 *   - TextSim uses TF-IDF cosine similarity on bio + skills text
 */
import type { Founder, Mentor, MatchResult, ExpertiseArea } from "./types";

// ============================================================================
// WEIGHTS — tunable parameters for the scoring function
// ============================================================================
const WEIGHTS = {
  complementarity: 0.30,
  alignment: 0.25,
  availability: 0.10,
  style: 0.10,
  textSimilarity: 0.25,
};

// ============================================================================
// 1. COSINE SIMILARITY (Machine Learning)
// ============================================================================

/** All possible expertise/challenge dimensions */
const ALL_EXPERTISE: ExpertiseArea[] = [
  "fundraising", "product-market-fit", "technical", "hiring", "go-to-market",
  "legal-compliance", "operations", "leadership", "international-expansion", "partnerships",
];

/**
 * Encode a list of expertise areas as a numeric vector with rank-decay weighting.
 * Items earlier in the list get higher weights (reflecting priority).
 *
 * v[k] = 1/(rank+1) if expertise[k] is in the list at position `rank`, else 0
 */
function encodeExpertiseVector(items: string[]): number[] {
  return ALL_EXPERTISE.map((dim) => {
    const idx = items.indexOf(dim);
    return idx >= 0 ? 1 / (idx + 1) : 0;
  });
}

/**
 * Cosine similarity: cos(θ) = (A·B) / (||A|| × ||B||)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Complementarity: cosine similarity between founder's needs vector
 * and mentor's expertise vector.
 */
function complementarityScore(founder: Founder, mentor: Mentor): number {
  const needsVec = encodeExpertiseVector(founder.looking_for);
  const expertiseVec = encodeExpertiseVector(mentor.expertise);
  return cosineSimilarity(needsVec, expertiseVec);
}

// ============================================================================
// 2. TF-IDF TEXT SIMILARITY (Information Retrieval)
// ============================================================================

/**
 * Simple TF-IDF implementation for computing text similarity between
 * founder and mentor profiles.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/** Compute term frequency: count of each token / total tokens */
function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  // Normalize by total length
  for (const [k, v] of tf) {
    tf.set(k, v / tokens.length);
  }
  return tf;
}

/** Compute inverse document frequency across a corpus */
function inverseDocFrequency(corpus: string[][]): Map<string, number> {
  const N = corpus.length;
  const df = new Map<string, number>();
  for (const doc of corpus) {
    const unique = new Set(doc);
    for (const t of unique) {
      df.set(t, (df.get(t) || 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log(N / count) + 1); // Smoothed IDF
  }
  return idf;
}

/** Build a TF-IDF vector for a document given an IDF map */
function tfidfVector(tokens: string[], idf: Map<string, number>): Map<string, number> {
  const tf = termFrequency(tokens);
  const tfidf = new Map<string, number>();
  for (const [term, freq] of tf) {
    tfidf.set(term, freq * (idf.get(term) || 1));
  }
  return tfidf;
}

/** Cosine similarity between two sparse TF-IDF vectors */
function tfidfCosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, normA = 0, normB = 0;
  for (const [term, val] of a) {
    if (b.has(term)) dot += val * b.get(term)!;
    normA += val * val;
  }
  for (const [, val] of b) {
    normB += val * val;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Compute text similarity between a founder and mentor using TF-IDF.
 * Combines bio + skills + industry-related text.
 */
function textSimilarityScore(
  founder: Founder,
  mentor: Mentor,
  allMentors: Mentor[],
  allFounders: Founder[]
): number {
  // Build text representations
  const founderText = [
    founder.bio,
    founder.one_liner,
    ...founder.skills,
    founder.industry,
    ...founder.challenges,
    ...founder.looking_for,
  ].join(" ");

  const mentorText = [
    mentor.bio,
    ...mentor.skills,
    ...mentor.industries,
    ...mentor.expertise,
    ...(mentor.notable_achievements || []),
  ].join(" ");

  // Build corpus for IDF computation
  const corpus = [
    ...allMentors.map((m) => tokenize([m.bio, ...m.skills, ...m.industries, ...m.expertise].join(" "))),
    ...allFounders.map((f) => tokenize([f.bio, f.one_liner, ...f.skills, f.industry].join(" "))),
  ];

  const idf = inverseDocFrequency(corpus);

  const founderVec = tfidfVector(tokenize(founderText), idf);
  const mentorVec = tfidfVector(tokenize(mentorText), idf);

  return tfidfCosineSimilarity(founderVec, mentorVec);
}

// ============================================================================
// 3. STRUCTURED SCORING (Statistics / Economics)
// ============================================================================

/**
 * Industry + stage alignment using Jaccard similarity.
 */
function alignmentScore(founder: Founder, mentor: Mentor): number {
  const industryMatch = mentor.industries.includes(founder.industry) ? 1.0 : 0.0;
  const stageMatch = mentor.preferred_stages.includes(founder.stage) ? 1.0 : 0.0;

  // Language overlap bonus
  const founderLangs = new Set(founder.languages?.map((l) => l.toLowerCase()) || []);
  const mentorLangs = new Set(mentor.languages?.map((l) => l.toLowerCase()) || []);
  const langIntersection = [...founderLangs].filter((l) => mentorLangs.has(l)).length;
  const langUnion = new Set([...founderLangs, ...mentorLangs]).size;
  const langScore = langUnion > 0 ? langIntersection / langUnion : 0;

  return industryMatch * 0.4 + stageMatch * 0.4 + langScore * 0.2;
}

/**
 * Availability: capacity, timezone, frequency alignment.
 */
function availabilityScore(founder: Founder, mentor: Mentor): number {
  if (mentor.current_mentees >= mentor.max_mentees) return 0.1;
  const capacityRatio = 1 - mentor.current_mentees / mentor.max_mentees;

  const fContinent = founder.timezone?.split("/")[0] || "";
  const mContinent = mentor.timezone?.split("/")[0] || "";
  const tzScore = fContinent === mContinent ? 1.0 : 0.5;

  const freqMap: Record<string, number> = { weekly: 3, biweekly: 2, monthly: 1 };
  const fFreq = freqMap[founder.meeting_frequency] || 2;
  const mFreq = freqMap[mentor.meeting_frequency] || 2;
  const freqScore = 1 - Math.abs(fFreq - mFreq) / 2;

  return capacityRatio * 0.4 + tzScore * 0.3 + freqScore * 0.3;
}

/**
 * Working style compatibility.
 */
function styleScore(founder: Founder, mentor: Mentor): number {
  if (founder.working_style === mentor.working_style) return 1.0;
  if (founder.working_style === "balanced" || mentor.working_style === "balanced") return 0.7;
  return 0.3;
}

// ============================================================================
// 4. GALE-SHAPLEY STABLE MATCHING (Economics — Nobel Prize 2012)
// ============================================================================

/**
 * Implementation of the Gale-Shapley Deferred Acceptance Algorithm.
 *
 * In the classic two-sided matching market (Gale & Shapley, 1962):
 *   - Founders "propose" to mentors based on their preference ranking
 *   - Mentors "accept" or "reject" based on their own preferences
 *   - The algorithm terminates with a stable matching where no founder-mentor
 *     pair would prefer to be matched with each other over their current match
 *
 * This produces a founder-optimal stable matching.
 *
 * Reference: Gale, D., & Shapley, L. S. (1962). "College Admissions and
 * the Stability of Marriage." The American Mathematical Monthly.
 */
function galeShapleyMatch(
  founderPrefs: Map<string, string[]>,   // founder_id -> ranked mentor_ids
  mentorPrefs: Map<string, string[]>,    // mentor_id -> ranked founder_ids
  mentorCapacity: Map<string, number>    // mentor_id -> max mentees
): Map<string, string[]> {
  // mentor_id -> currently matched founder_ids
  const mentorMatches = new Map<string, string[]>();
  for (const [mId] of mentorPrefs) {
    mentorMatches.set(mId, []);
  }

  // Track which mentor each founder has proposed to next
  const founderNextProposal = new Map<string, number>();
  for (const [fId] of founderPrefs) {
    founderNextProposal.set(fId, 0);
  }

  // founder_id -> matched mentor_id or null
  const founderMatch = new Map<string, string | null>();
  for (const [fId] of founderPrefs) {
    founderMatch.set(fId, null);
  }

  // Build mentor preference rank lookup for O(1) comparison
  const mentorRank = new Map<string, Map<string, number>>();
  for (const [mId, prefs] of mentorPrefs) {
    const rankMap = new Map<string, number>();
    prefs.forEach((fId, rank) => rankMap.set(fId, rank));
    mentorRank.set(mId, rankMap);
  }

  // Queue of unmatched founders
  const freeFounders: string[] = [...founderPrefs.keys()];

  while (freeFounders.length > 0) {
    const founderId = freeFounders[0];
    const prefs = founderPrefs.get(founderId)!;
    const nextIdx = founderNextProposal.get(founderId)!;

    if (nextIdx >= prefs.length) {
      // Exhausted all proposals
      freeFounders.shift();
      continue;
    }

    const mentorId = prefs[nextIdx];
    founderNextProposal.set(founderId, nextIdx + 1);

    const capacity = mentorCapacity.get(mentorId) || 1;
    const currentMatches = mentorMatches.get(mentorId) || [];
    const mRank = mentorRank.get(mentorId);

    if (currentMatches.length < capacity) {
      // Mentor has capacity — accept
      currentMatches.push(founderId);
      mentorMatches.set(mentorId, currentMatches);
      founderMatch.set(founderId, mentorId);
      freeFounders.shift();
    } else if (mRank) {
      // Mentor at capacity — check if this founder is preferred over worst current
      const worstCurrent = currentMatches.reduce((worst, fId) =>
        (mRank.get(fId) || Infinity) > (mRank.get(worst) || Infinity) ? fId : worst
      );

      const founderRank = mRank.get(founderId) ?? Infinity;
      const worstRank = mRank.get(worstCurrent) ?? Infinity;

      if (founderRank < worstRank) {
        // Replace worst with this founder
        const idx = currentMatches.indexOf(worstCurrent);
        currentMatches[idx] = founderId;
        mentorMatches.set(mentorId, currentMatches);
        founderMatch.set(founderId, mentorId);
        founderMatch.set(worstCurrent, null);
        freeFounders.shift();
        freeFounders.push(worstCurrent); // Rejected founder goes back to queue
      }
      // else: rejected, stays in queue and will propose to next
    }
  }

  return mentorMatches;
}

// ============================================================================
// 5. COMPOSITE SCORING + MATCH RANKING
// ============================================================================

/**
 * Generate a human-readable reason for the match.
 */
function generateReason(founder: Founder, mentor: Mentor, breakdown: MatchResult["breakdown"], stable: boolean): string {
  const reasons: string[] = [];

  const matchedExpertise = founder.looking_for.filter((need) =>
    mentor.expertise.includes(need)
  );
  if (matchedExpertise.length > 0) {
    reasons.push(`Direct expertise in ${matchedExpertise.map((e) => e.replace(/-/g, " ")).join(", ")}`);
  }
  if (mentor.industries.includes(founder.industry)) {
    reasons.push(`Deep experience in ${founder.industry.replace(/-/g, " ")}`);
  }
  if (mentor.preferred_stages.includes(founder.stage)) {
    reasons.push(`Prefers ${founder.stage} stage startups`);
  }
  if (breakdown.textSimilarity > 0.3) {
    reasons.push("Strong profile alignment based on text analysis");
  }
  if (mentor.avg_rating >= 4.8) {
    reasons.push(`Highly rated (${mentor.avg_rating}/5)`);
  }
  if (stable) {
    reasons.push("Stable match (Gale-Shapley verified)");
  }

  return reasons.slice(0, 4).join(". ") + ".";
}

/**
 * Main matching function: rank all mentors for a given founder.
 * Combines composite scoring with Gale-Shapley stability verification.
 */
export function rankMentorsForFounder(
  founder: Founder,
  allMentors: Mentor[],
  allFounders: Founder[] = []
): MatchResult[] {
  // Step 1: Compute pairwise composite scores
  const scored = allMentors.map((mentor) => {
    const breakdown = {
      complementarity: complementarityScore(founder, mentor),
      alignment: alignmentScore(founder, mentor),
      availability: availabilityScore(founder, mentor),
      style: styleScore(founder, mentor),
      textSimilarity: textSimilarityScore(founder, mentor, allMentors, allFounders.length > 0 ? allFounders : [founder]),
    };

    const score =
      WEIGHTS.complementarity * breakdown.complementarity +
      WEIGHTS.alignment * breakdown.alignment +
      WEIGHTS.availability * breakdown.availability +
      WEIGHTS.style * breakdown.style +
      WEIGHTS.textSimilarity * breakdown.textSimilarity;

    return { mentor, score, breakdown };
  });

  // Step 2: Run Gale-Shapley to identify stable matches
  // Build preference lists from scores
  const foundersForGS = allFounders.length > 0 ? allFounders : [founder];

  const founderPrefs = new Map<string, string[]>();
  for (const f of foundersForGS) {
    const rankedMentors = allMentors
      .map((m) => ({
        id: m.id,
        score:
          WEIGHTS.complementarity * complementarityScore(f, m) +
          WEIGHTS.alignment * alignmentScore(f, m) +
          WEIGHTS.availability * availabilityScore(f, m) +
          WEIGHTS.style * styleScore(f, m),
      }))
      .sort((a, b) => b.score - a.score)
      .map((m) => m.id);
    founderPrefs.set(f.id, rankedMentors);
  }

  const mentorPrefs = new Map<string, string[]>();
  const mentorCapacity = new Map<string, number>();
  for (const m of allMentors) {
    const rankedFounders = foundersForGS
      .map((f) => ({
        id: f.id,
        score: alignmentScore(f, m) + complementarityScore(f, m),
      }))
      .sort((a, b) => b.score - a.score)
      .map((f) => f.id);
    mentorPrefs.set(m.id, rankedFounders);
    mentorCapacity.set(m.id, Math.max(m.max_mentees - m.current_mentees, 1));
  }

  const stableMatches = galeShapleyMatch(founderPrefs, mentorPrefs, mentorCapacity);

  // Find which mentors are stably matched with this specific founder
  const stableMentorIds = new Set<string>();
  for (const [mentorId, founderIds] of stableMatches) {
    if (founderIds.includes(founder.id)) {
      stableMentorIds.add(mentorId);
    }
  }

  // Step 3: Combine and produce final results
  const results: MatchResult[] = scored.map(({ mentor, score, breakdown }) => ({
    mentor,
    score,
    breakdown,
    reason: generateReason(founder, mentor, breakdown, stableMentorIds.has(mentor.id)),
    stable: stableMentorIds.has(mentor.id),
  }));

  // Sort: stable matches first (among top scores), then by score
  results.sort((a, b) => {
    // If scores are close (within 5%), prefer stable matches
    if (Math.abs(a.score - b.score) < 0.05 && a.stable !== b.stable) {
      return a.stable ? -1 : 1;
    }
    return b.score - a.score;
  });

  return results;
}

/**
 * Find top N matches for a founder.
 */
export function findTopMatches(
  founder: Founder,
  allMentors: Mentor[],
  n: number = 5,
  allFounders: Founder[] = []
): MatchResult[] {
  return rankMentorsForFounder(founder, allMentors, allFounders).slice(0, n);
}
