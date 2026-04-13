export type StartupStage = "idea" | "pre-seed" | "seed" | "series-a" | "series-b+";

export type Industry =
  | "fintech"
  | "healthtech"
  | "edtech"
  | "climate"
  | "saas"
  | "marketplace"
  | "ai-ml"
  | "biotech"
  | "ecommerce"
  | "deeptech"
  | "social-impact"
  | "logistics"
  | "proptech"
  | "gaming"
  | "cybersecurity";

export type BusinessModel = "b2b-saas" | "marketplace" | "d2c" | "b2b2c" | "api-platform" | "hardware" | "services";

export type Challenge =
  | "fundraising"
  | "product-market-fit"
  | "technical"
  | "hiring"
  | "go-to-market"
  | "legal-compliance"
  | "operations"
  | "leadership"
  | "international-expansion"
  | "partnerships";

export type ExpertiseArea = Challenge;

export type WorkingStyle = "hands-on" | "strategic" | "balanced";
export type MeetingFrequency = "weekly" | "biweekly" | "monthly";
export type MentorMotivation = "giving-back" | "deal-flow" | "sector-learning" | "advisory-equity" | "networking";

export interface ContactInfo {
  email: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Founder {
  id: string;
  name: string;
  avatar: string;
  contacts: ContactInfo;
  company: string;
  one_liner: string;
  bio: string;
  stage: StartupStage;
  industry: Industry;
  business_model: BusinessModel;
  team_size: number;
  team_composition: "technical" | "business" | "mixed";
  challenges: Challenge[];
  looking_for: ExpertiseArea[];
  working_style: WorkingStyle;
  meeting_frequency: MeetingFrequency;
  timezone: string;
  location: string;
  languages: string[];
  // Fundraising info
  funding_raised?: string;
  revenue_stage?: "pre-revenue" | "early-revenue" | "<$1M ARR" | "$1M-$10M ARR" | "$10M+ ARR";
  // Media & documents
  pitch_deck_url?: string;
  video_url?: string;
  documents?: { name: string; url: string }[];
  // Skills & tags
  skills: string[];
  created_at: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  contacts: ContactInfo;
  current_role: string;
  company: string;
  bio: string;
  years_experience: number;
  industries: Industry[];
  expertise: ExpertiseArea[];
  preferred_stages: StartupStage[];
  looks_for_in_founders: string[];
  max_mentees: number;
  current_mentees: number;
  motivation: MentorMotivation[];
  working_style: WorkingStyle;
  meeting_frequency: MeetingFrequency;
  timezone: string;
  location: string;
  languages: string[];
  // Professional
  skills: string[];
  notable_achievements?: string[];
  portfolio_companies?: string[];
  // Engagement
  sessions_completed: number;
  avg_rating: number;
  calendly_url?: string;
  created_at: string;
}

export interface MatchResult {
  mentor: Mentor;
  score: number;
  breakdown: {
    complementarity: number;
    alignment: number;
    availability: number;
    style: number;
    textSimilarity: number;
  };
  reason: string;
  stable: boolean; // Whether this is a stable match (Gale-Shapley)
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface MatchFeedback {
  id: string;
  founder_id: string;
  founder_name: string;
  mentor_id: string;
  mentor_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SupplyGap {
  id: string;
  founder_name: string;
  founder_email: string;
  needs: string[];
  industry: string;
  stage: string;
  description?: string;
  created_at: string;
}
