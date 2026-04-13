/**
 * Dynamic data store that merges static seed data with localStorage signups.
 * This allows new signups to appear in the directory, AI chat, and matching.
 */
import { mentors as seedMentors, founders as seedFounders } from "./data";
import type { Mentor, Founder, MatchFeedback, SupplyGap } from "./types";

const MENTORS_KEY = "lemons_custom_mentors";
const FOUNDERS_KEY = "lemons_custom_founders";
const FEEDBACK_KEY = "lemons_feedback";
const GAPS_KEY = "lemons_supply_gaps";

function safeGet<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Mentors
// ---------------------------------------------------------------------------

export function getAllMentors(): Mentor[] {
  const custom = safeGet<Mentor>(MENTORS_KEY);
  return [...seedMentors, ...custom];
}

export function addMentor(mentor: Mentor): void {
  const existing = safeGet<Mentor>(MENTORS_KEY);
  existing.push(mentor);
  localStorage.setItem(MENTORS_KEY, JSON.stringify(existing));
}

// ---------------------------------------------------------------------------
// Founders
// ---------------------------------------------------------------------------

export function getAllFounders(): Founder[] {
  const custom = safeGet<Founder>(FOUNDERS_KEY);
  return [...seedFounders, ...custom];
}

export function addFounder(founder: Founder): void {
  const existing = safeGet<Founder>(FOUNDERS_KEY);
  existing.push(founder);
  localStorage.setItem(FOUNDERS_KEY, JSON.stringify(existing));
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export function getAllFeedback(): MatchFeedback[] {
  return safeGet<MatchFeedback>(FEEDBACK_KEY);
}

export function addFeedback(fb: MatchFeedback): void {
  const existing = safeGet<MatchFeedback>(FEEDBACK_KEY);
  existing.push(fb);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(existing));
}

// ---------------------------------------------------------------------------
// Supply Gaps
// ---------------------------------------------------------------------------

export function getAllSupplyGaps(): SupplyGap[] {
  return safeGet<SupplyGap>(GAPS_KEY);
}

export function addSupplyGap(gap: SupplyGap): void {
  const existing = safeGet<SupplyGap>(GAPS_KEY);
  existing.push(gap);
  localStorage.setItem(GAPS_KEY, JSON.stringify(existing));
}
