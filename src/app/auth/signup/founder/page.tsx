"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  stageLabels,
  industryLabels,
  businessModelLabels,
  challengeLabels,
  workingStyleLabels,
  meetingFrequencyLabels,
} from "@/lib/questionnaire-options";
import type {
  StartupStage,
  Industry,
  BusinessModel,
  Challenge,
  WorkingStyle,
  MeetingFrequency,
} from "@/lib/types";

const STEPS = ["Basic Info", "Company Details", "Needs & Preferences", "Review"];

export default function FounderSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [bio, setBio] = useState("");

  // Step 2: Company Details
  const [stage, setStage] = useState<StartupStage | "">("");
  const [industry, setIndustry] = useState<Industry | "">("");
  const [businessModel, setBusinessModel] = useState<BusinessModel | "">("");
  const [teamSize, setTeamSize] = useState("");
  const [teamComposition, setTeamComposition] = useState<"technical" | "business" | "mixed" | "">("");

  // Step 3: Needs & Preferences
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lookingFor, setLookingFor] = useState<Challenge[]>([]);
  const [workingStyle, setWorkingStyle] = useState<WorkingStyle | "">("");
  const [meetingFrequency, setMeetingFrequency] = useState<MeetingFrequency | "">("");
  const [timezone, setTimezone] = useState("");

  function toggleChallenge(c: Challenge) {
    setChallenges((prev) =>
      prev.includes(c)
        ? prev.filter((x) => x !== c)
        : prev.length < 3
        ? [...prev, c]
        : prev
    );
  }

  function toggleLookingFor(c: Challenge) {
    setLookingFor((prev) =>
      prev.includes(c)
        ? prev.filter((x) => x !== c)
        : prev.length < 3
        ? [...prev, c]
        : prev
    );
  }

  function handleSubmit() {
    const founderProfile = {
      type: "founder",
      id: `f-${Date.now()}`,
      name,
      email,
      company,
      one_liner: oneLiner,
      bio,
      stage,
      industry,
      business_model: businessModel,
      team_size: parseInt(teamSize) || 1,
      team_composition: teamComposition,
      challenges,
      looking_for: lookingFor,
      working_style: workingStyle,
      meeting_frequency: meetingFrequency,
      timezone,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("lemons_user", JSON.stringify(founderProfile));
    router.push("/match/results");
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return name && email && password && company;
      case 1:
        return stage && industry && businessModel && teamComposition;
      case 2:
        return challenges.length > 0 && lookingFor.length > 0 && workingStyle && meetingFrequency;
      default:
        return true;
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-sm sm:block ${i === step ? "font-medium" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            {STEPS[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@startup.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your startup name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oneliner">One-Liner</Label>
                <Input id="oneliner" value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="What does your startup do in one sentence?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself and your startup..." rows={3} />
              </div>
            </>
          )}

          {/* Step 2: Company Details */}
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Startup Stage *</Label>
                  <Select value={stage} onValueChange={(v) => setStage((v ?? "") as StartupStage | "")}>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(stageLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Industry *</Label>
                  <Select value={industry} onValueChange={(v) => setIndustry((v ?? "") as Industry | "")}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(industryLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Model *</Label>
                <Select value={businessModel} onValueChange={(v) => setBusinessModel((v ?? "") as BusinessModel | "")}>
                  <SelectTrigger><SelectValue placeholder="Select business model" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(businessModelLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input id="teamSize" type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="How many people?" />
                </div>
                <div className="space-y-2">
                  <Label>Team Composition *</Label>
                  <Select value={teamComposition} onValueChange={(v) => setTeamComposition((v ?? "") as "technical" | "business" | "mixed" | "")}>
                    <SelectTrigger><SelectValue placeholder="Select composition" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Mostly Technical</SelectItem>
                      <SelectItem value="business">Mostly Business</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Needs & Preferences */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label>Top Challenges (select up to 3) *</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(challengeLabels).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant={challenges.includes(k as Challenge) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleChallenge(k as Challenge)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>What are you looking for in a mentor? (select up to 3) *</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(challengeLabels).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant={lookingFor.includes(k as Challenge) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleLookingFor(k as Challenge)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Working Style *</Label>
                  <Select value={workingStyle} onValueChange={(v) => setWorkingStyle((v ?? "") as WorkingStyle | "")}>
                    <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(workingStyleLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Meeting Frequency *</Label>
                  <Select value={meetingFrequency} onValueChange={(v) => setMeetingFrequency((v ?? "") as MeetingFrequency | "")}>
                    <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(meetingFrequencyLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. America/Mexico_City" />
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div><span className="font-medium">Name:</span> {name}</div>
                  <div><span className="font-medium">Email:</span> {email}</div>
                  <div><span className="font-medium">Company:</span> {company}</div>
                  <div><span className="font-medium">Stage:</span> {stage ? stageLabels[stage as StartupStage] : "—"}</div>
                  <div><span className="font-medium">Industry:</span> {industry ? industryLabels[industry as Industry] : "—"}</div>
                  <div><span className="font-medium">Model:</span> {businessModel ? businessModelLabels[businessModel as BusinessModel] : "—"}</div>
                  <div><span className="font-medium">Team:</span> {teamSize || "—"} ({teamComposition || "—"})</div>
                </div>
                {oneLiner && (
                  <div className="text-sm"><span className="font-medium">One-liner:</span> {oneLiner}</div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-sm font-medium">Challenges:</span>
                  {challenges.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">{challengeLabels[c]}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-sm font-medium">Looking for:</span>
                  {lookingFor.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">{challengeLabels[c]}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                By submitting, you&apos;ll be matched with mentors based on your profile. You can update your information at any time.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="gap-1"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-1">
                <Check className="h-4 w-4" /> Find My Mentors
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
