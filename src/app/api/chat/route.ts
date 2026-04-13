import { NextRequest, NextResponse } from "next/server";
import { groq, isGroqConfigured } from "@/lib/groq";
import { mentors as seedMentors, founders as seedFounders } from "@/lib/data";
import type { ChatMessage, Mentor, Founder } from "@/lib/types";

// ---------------------------------------------------------------------------
// Keyword-based fallback (works without Groq API key)
// ---------------------------------------------------------------------------

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  fintech: ["fintech", "finance", "payments", "banking", "money"],
  healthtech: ["health", "medical", "medicine", "healthcare", "hospital"],
  edtech: ["education", "learning", "school", "university", "teaching", "students"],
  climate: ["climate", "carbon", "sustainability", "green", "environment", "energy"],
  saas: ["saas", "software", "platform", "enterprise", "b2b"],
  marketplace: ["marketplace", "two-sided", "supply", "demand"],
  "ai-ml": ["ai", "ml", "machine learning", "artificial intelligence", "deep learning", "llm", "gpt"],
  biotech: ["biotech", "biology", "genomics", "pharma", "drug", "genetics"],
  ecommerce: ["ecommerce", "e-commerce", "online store", "retail", "shopping"],
  deeptech: ["deep tech", "deeptech", "research", "science", "hardware"],
  "social-impact": ["social impact", "nonprofit", "social", "impact", "community"],
  logistics: ["logistics", "supply chain", "shipping", "delivery", "warehouse"],
  proptech: ["proptech", "real estate", "property", "housing"],
  cybersecurity: ["cybersecurity", "security", "hacking", "infosec", "penetration"],
  gaming: ["gaming", "games", "esports"],
};

const EXPERTISE_KEYWORDS: Record<string, string[]> = {
  fundraising: ["fundraising", "funding", "raise", "investor", "vc", "venture capital", "capital", "money"],
  "product-market-fit": ["product market fit", "pmf", "product-market", "market fit", "validation"],
  technical: ["technical", "engineering", "architecture", "code", "tech", "cto"],
  hiring: ["hiring", "recruiting", "team", "talent", "people"],
  "go-to-market": ["go to market", "gtm", "growth", "marketing", "sales", "customer acquisition"],
  "legal-compliance": ["legal", "compliance", "regulation", "law"],
  operations: ["operations", "scaling", "ops", "processes"],
  leadership: ["leadership", "management", "ceo", "executive"],
  "international-expansion": ["international", "expansion", "global", "latam", "latin america", "cross-border"],
  partnerships: ["partnerships", "business development", "bd", "partners", "alliances"],
};

const STAGE_KEYWORDS: Record<string, string[]> = {
  idea: ["idea", "just starting", "concept", "early"],
  "pre-seed": ["pre-seed", "preseed", "very early", "just started"],
  seed: ["seed", "early stage"],
  "series-a": ["series a", "series-a", "growing", "scaling"],
  "series-b+": ["series b", "series-b", "late stage", "mature"],
};

function findKeywordMatches(text: string, keywords: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  for (const [key, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      matches.push(key);
    }
  }
  return matches;
}

function scoreMentor(mentor: Mentor, industries: string[], expertise: string[], stages: string[]): number {
  let score = 0;
  for (const ind of industries) {
    if (mentor.industries.includes(ind as any)) score += 3;
  }
  for (const exp of expertise) {
    if (mentor.expertise.includes(exp as any)) score += 4;
  }
  for (const st of stages) {
    if (mentor.preferred_stages.includes(st as any)) score += 2;
  }
  // Bonus for availability and rating
  if (mentor.current_mentees < mentor.max_mentees) score += 1;
  score += mentor.avg_rating * 0.5;
  return score;
}

function scoreFounder(founder: Founder, industries: string[], expertise: string[], stages: string[]): number {
  let score = 0;
  if (industries.includes(founder.industry)) score += 3;
  for (const exp of expertise) {
    if (founder.challenges.includes(exp as any)) score += 2;
    if (founder.looking_for.includes(exp as any)) score += 2;
  }
  for (const st of stages) {
    if (founder.stage === st) score += 3;
  }
  return score;
}

function formatLabel(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fallbackMentorResponse(message: string, mentors: Mentor[]): string {
  const industries = findKeywordMatches(message, INDUSTRY_KEYWORDS);
  const expertise = findKeywordMatches(message, EXPERTISE_KEYWORDS);
  const stages = findKeywordMatches(message, STAGE_KEYWORDS);

  if (industries.length === 0 && expertise.length === 0 && stages.length === 0) {
    // General response
    const topMentors = [...mentors].sort((a, b) => b.avg_rating - a.avg_rating).slice(0, 3);
    return `I'd love to help you find the right mentor! Could you tell me more about:\n\n- Your **industry** (e.g., fintech, healthtech, climate)\n- Your **startup stage** (idea, pre-seed, seed, Series A+)\n- What **help you need** (fundraising, technical, go-to-market, hiring)\n\nIn the meantime, here are some of our top-rated mentors:\n\n${topMentors.map((m) => `**${m.name}** — ${m.current_role} at ${m.company}. Expert in ${m.expertise.slice(0, 2).map(formatLabel).join(", ")}. Rating: ${m.avg_rating}/5`).join("\n\n")}`;
  }

  // Score and rank mentors
  const ranked = mentors
    .map((m) => ({ mentor: m, score: scoreMentor(m, industries, expertise, stages) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) {
    return `I couldn't find a strong match based on your description. Could you provide more details about your industry, stage, or what specific help you need?`;
  }

  const context: string[] = [];
  if (industries.length) context.push(`industry: ${industries.map(formatLabel).join(", ")}`);
  if (expertise.length) context.push(`needs: ${expertise.map(formatLabel).join(", ")}`);
  if (stages.length) context.push(`stage: ${stages.map(formatLabel).join(", ")}`);

  return `Based on what you've shared (${context.join("; ")}), here are my top recommendations:\n\n${ranked
    .map(
      (r, i) =>
        `**${i + 1}. ${r.mentor.name}** — ${r.mentor.current_role} at ${r.mentor.company}\n${r.mentor.bio.slice(0, 150)}...\nExpertise: ${r.mentor.expertise.map(formatLabel).join(", ")} | Rating: ${r.mentor.avg_rating}/5 | ${r.mentor.sessions_completed} sessions completed`
    )
    .join("\n\n")}\n\nWould you like more details about any of these mentors, or should I refine the search?`;
}

function fallbackFounderResponse(message: string, founders: Founder[]): string {
  const industries = findKeywordMatches(message, INDUSTRY_KEYWORDS);
  const expertise = findKeywordMatches(message, EXPERTISE_KEYWORDS);
  const stages = findKeywordMatches(message, STAGE_KEYWORDS);

  if (industries.length === 0 && expertise.length === 0 && stages.length === 0) {
    const sample = founders.slice(0, 3);
    return `I can help you find founders to connect with! Tell me about:\n\n- **Industry** you're interested in\n- **Stage** of startups you'd like to meet\n- **Shared challenges** or interests\n\nHere are some founders in our network:\n\n${sample.map((f) => `**${f.name}** — ${f.company}: ${f.one_liner}`).join("\n\n")}`;
  }

  const ranked = founders
    .map((f) => ({ founder: f, score: scoreFounder(f, industries, expertise, stages) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) {
    return `I couldn't find founders matching that description. Try mentioning a specific industry, stage, or area of interest.`;
  }

  return `Here are founders that match your interests:\n\n${ranked
    .map(
      (r, i) =>
        `**${i + 1}. ${r.founder.name}** — ${r.founder.company}\n${r.founder.one_liner}\nStage: ${formatLabel(r.founder.stage)} | Industry: ${formatLabel(r.founder.industry)} | Challenges: ${r.founder.challenges.map(formatLabel).join(", ")}`
    )
    .join("\n\n")}\n\nWant to know more about any of them?`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message: string;
      type: "mentors" | "founders";
      history: ChatMessage[];
      mentors?: Mentor[];
      founders?: Founder[];
    };
    const { message, type, history } = body;

    // Use client-provided data (includes localStorage signups) or fall back to seed data
    const mentors: Mentor[] = body.mentors?.length ? body.mentors : seedMentors;
    const founders: Founder[] = body.founders?.length ? body.founders : seedFounders;

    // If Groq is configured, try LLM first, fall back to keyword matching on error
    if (isGroqConfigured && groq) {
      try {
        const data = type === "mentors" ? mentors : founders;
        const systemPrompt = `You are the Lemons AI assistant, helping users discover ${type} in the EPIC-Lab network. You have access to the following ${type} database:\n\n${JSON.stringify(data, null, 2)}\n\nWhen users describe what they need, recommend specific people by name with reasons. Be concise, warm, and specific. Always reference actual people from the database. Use markdown formatting for names (bold) and structure your response clearly.`;

        const chatMessages = [
          { role: "system" as const, content: systemPrompt },
          ...history
            .filter((m) => m.id !== "welcome")
            .map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
          { role: "user" as const, content: message },
        ];

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 1024,
        });

        return NextResponse.json({
          response: completion.choices[0]?.message?.content || "I couldn't generate a response.",
        });
      } catch (groqError) {
        console.error("Groq API error, falling back to keyword matching:", groqError);
        // Fall through to keyword matching below
      }
    }

    // Fallback: keyword-based matching
    const response =
      type === "mentors"
        ? fallbackMentorResponse(message, mentors)
        : fallbackFounderResponse(message, founders);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
