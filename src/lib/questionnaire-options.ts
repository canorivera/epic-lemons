import type {
  StartupStage,
  Industry,
  BusinessModel,
  Challenge,
  ExpertiseArea,
  WorkingStyle,
  MeetingFrequency,
  MentorMotivation,
} from "./types";

export const stageLabels: Record<StartupStage, string> = {
  idea: "Idea Stage",
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b+": "Series B+",
};

export const industryLabels: Record<Industry, string> = {
  fintech: "Fintech",
  healthtech: "Healthtech",
  edtech: "Edtech",
  climate: "Climate Tech",
  saas: "SaaS",
  marketplace: "Marketplace",
  "ai-ml": "AI / ML",
  biotech: "Biotech",
  ecommerce: "E-Commerce",
  deeptech: "Deep Tech",
  "social-impact": "Social Impact",
  logistics: "Logistics",
  proptech: "Proptech",
  gaming: "Gaming",
  cybersecurity: "Cybersecurity",
};

export const businessModelLabels: Record<BusinessModel, string> = {
  "b2b-saas": "B2B SaaS",
  marketplace: "Marketplace",
  d2c: "Direct to Consumer",
  b2b2c: "B2B2C",
  "api-platform": "API / Platform",
  hardware: "Hardware",
  services: "Services",
};

export const challengeLabels: Record<Challenge, string> = {
  fundraising: "Fundraising",
  "product-market-fit": "Product-Market Fit",
  technical: "Technical Architecture",
  hiring: "Hiring & Team Building",
  "go-to-market": "Go-to-Market Strategy",
  "legal-compliance": "Legal & Compliance",
  operations: "Operations & Scaling",
  leadership: "Leadership & Management",
  "international-expansion": "International Expansion",
  partnerships: "Partnerships & BD",
};

export const expertiseLabels: Record<ExpertiseArea, string> = challengeLabels;

export const workingStyleLabels: Record<WorkingStyle, string> = {
  "hands-on": "Hands-on (tactical, in the weeds)",
  strategic: "Strategic (big picture, high-level)",
  balanced: "Balanced (mix of both)",
};

export const meetingFrequencyLabels: Record<MeetingFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Every two weeks",
  monthly: "Monthly",
};

export const motivationLabels: Record<MentorMotivation, string> = {
  "giving-back": "Giving Back",
  "deal-flow": "Deal Flow",
  "sector-learning": "Learning About New Sectors",
  "advisory-equity": "Advisory Equity",
  networking: "Networking",
};
