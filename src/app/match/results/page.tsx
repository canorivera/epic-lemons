"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mentors } from "@/lib/data";
import { findTopMatches } from "@/lib/matching";
import type { Founder, MatchResult } from "@/lib/types";
import { challengeLabels, industryLabels, stageLabels } from "@/lib/questionnaire-options";

function formatLabel(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function MatchResultsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { rating: number; comment: string }>>({});
  const [reported, setReported] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("lemons_user");
    if (!userJson) {
      router.push("/auth/login");
      return;
    }

    const user = JSON.parse(userJson);
    if (user.type !== "founder") {
      router.push("/dashboard");
      return;
    }

    // Build a Founder object from the stored profile
    const founder: Founder = {
      id: user.id || "demo",
      name: user.name || "Demo User",
      avatar: "",
      email: user.email || "",
      company: user.company || "Demo Startup",
      one_liner: user.one_liner || "",
      bio: user.bio || "",
      stage: user.stage || "seed",
      industry: user.industry || "saas",
      business_model: user.business_model || "b2b-saas",
      team_size: user.team_size || 5,
      team_composition: user.team_composition || "mixed",
      challenges: user.challenges || ["fundraising", "go-to-market"],
      looking_for: user.looking_for || ["fundraising", "go-to-market"],
      working_style: user.working_style || "balanced",
      meeting_frequency: user.meeting_frequency || "biweekly",
      timezone: user.timezone || "America/Mexico_City",
      created_at: user.created_at || new Date().toISOString(),
    };

    const results = findTopMatches(founder, mentors, 8);
    setMatches(results);
  }, [router]);

  function submitFeedback(mentorId: string) {
    const fb = feedback[mentorId];
    if (!fb) return;
    // Store feedback in localStorage for demo
    const existing = JSON.parse(localStorage.getItem("lemons_feedback") || "[]");
    existing.push({
      mentor_id: mentorId,
      ...fb,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("lemons_feedback", JSON.stringify(existing));
    alert("Thank you for your feedback!");
  }

  function reportNoMatch() {
    setReported(true);
    // In production, this would alert admins
    const gaps = JSON.parse(localStorage.getItem("lemons_supply_gaps") || "[]");
    const user = JSON.parse(localStorage.getItem("lemons_user") || "{}");
    gaps.push({
      founder: user.name,
      needs: user.looking_for,
      industry: user.industry,
      stage: user.stage,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("lemons_supply_gaps", JSON.stringify(gaps));
  }

  if (matches.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading your matches...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Your Top Matches</h1>
        </div>
        <p className="text-muted-foreground">
          Based on your profile, here are the mentors most likely to help you succeed.
          Scores reflect expertise alignment, industry fit, availability, and working style.
        </p>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <Card
            key={match.mentor.id}
            className={`transition-all ${index === 0 ? "border-primary/50 shadow-md" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                        {getInitials(match.mentor.name)}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        1
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{match.mentor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {match.mentor.current_role} at {match.mentor.company}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(match.score * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">match score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match reason */}
              <p className="text-sm">{match.reason}</p>

              {/* Score breakdown */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Expertise", value: match.breakdown.complementarity },
                  { label: "Alignment", value: match.breakdown.alignment },
                  { label: "Availability", value: match.breakdown.availability },
                  { label: "Style", value: match.breakdown.style },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${item.value * 100}%` }}
                      />
                    </div>
                    <div className="text-xs font-medium mt-1">{Math.round(item.value * 100)}%</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {match.mentor.industries.map((ind) => (
                  <Badge key={ind} variant="secondary" className="text-xs">
                    {formatLabel(ind)}
                  </Badge>
                ))}
                {match.mentor.expertise.map((exp) => (
                  <Badge key={exp} variant="outline" className="text-xs">
                    {formatLabel(exp)}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  {match.mentor.avg_rating}/5
                </span>
                <span>{match.mentor.sessions_completed} sessions</span>
                <span>{match.mentor.timezone.split("/").pop()?.replace(/_/g, " ")}</span>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    window.open(match.mentor.calendly_url || "https://calendly.com", "_blank")
                  }
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Book a Session
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setExpanded(expanded === match.mentor.id ? null : match.mentor.id)
                  }
                  className="gap-1.5"
                >
                  {expanded === match.mentor.id ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" /> Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> More Details
                    </>
                  )}
                </Button>
              </div>

              {/* Expanded details + feedback */}
              {expanded === match.mentor.id && (
                <div className="space-y-4 pt-2">
                  <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                    <p>{match.mentor.bio}</p>
                    <p>
                      <strong>Experience:</strong> {match.mentor.years_experience} years
                    </p>
                    <p>
                      <strong>Working style:</strong> {formatLabel(match.mentor.working_style)}
                    </p>
                    <p>
                      <strong>Meets:</strong> {formatLabel(match.mentor.meeting_frequency)}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {match.mentor.current_mentees}/{match.mentor.max_mentees} mentees
                    </p>
                  </div>

                  {/* Feedback form */}
                  <div className="rounded-lg border border-border p-4 space-y-3">
                    <p className="text-sm font-medium">Rate this match suggestion</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setFeedback((prev) => ({
                              ...prev,
                              [match.mentor.id]: {
                                ...prev[match.mentor.id],
                                rating: star,
                              },
                            }))
                          }
                          className="transition-colors"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              (feedback[match.mentor.id]?.rating || 0) >= star
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Any feedback on this match? (optional)"
                      value={feedback[match.mentor.id]?.comment || ""}
                      onChange={(e) =>
                        setFeedback((prev) => ({
                          ...prev,
                          [match.mentor.id]: {
                            ...prev[match.mentor.id],
                            comment: e.target.value,
                          },
                        }))
                      }
                      rows={2}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => submitFeedback(match.mentor.id)}
                      disabled={!feedback[match.mentor.id]?.rating}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report no good match */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              None of these matches feel right?
            </p>
          </div>
          {reported ? (
            <Badge variant="secondary">Reported — we&apos;ll review your needs</Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={reportNoMatch}>
              Report Supply Gap
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
