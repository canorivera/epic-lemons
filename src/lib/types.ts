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

export interface Founder {
  id: string;
  name: string;
  avatar: string;
  email: string;
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
  linkedin?: string;
  website?: string;
  created_at: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  email: string;
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
  linkedin?: string;
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
  };
  reason: string;
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
  mentor_id: string;
  rating: number;
  comment: string;
  helpful: boolean;
  created_at: string;
}
