"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Rocket, Upload, Video, FileText } from "lucide-react";
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
import { addFounder } from "@/lib/store";
import type {
  StartupStage,
  Industry,
  BusinessModel,
  Challenge,
  WorkingStyle,
  MeetingFrequency,
  Founder,
} from "@/lib/types";

const STEPS = ["Basic Info", "Company Details", "Needs & Preferences", "Media & Links", "Review"];

const REVENUE_OPTIONS = [
  { value: "pre-revenue", label: "Pre-Revenue" },
  { value: "early-revenue", label: "Early Revenue" },
  { value: "<$1M ARR", label: "< $1M ARR" },
  { value: "$1M-$10M ARR", label: "$1M - $10M ARR" },
  { value: "$10M+ ARR", label: "$10M+ ARR" },
];

export default function FounderSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");

  // Step 2: Company Details
  const [company, setCompany] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [bio, setBio] = useState("");
  const [stage, setStage] = useState<StartupStage | "">("");
  const [industry, setIndustry] = useState<Industry | "">("");
  const [businessModel, setBusinessModel] = useState<BusinessModel | "">("");
  const [teamSize, setTeamSize] = useState("");
  const [teamComposition, setTeamComposition] = useState<"technical" | "business" | "mixed" | "">("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");
  const [fundingRaised, setFundingRaised] = useState("");
  const [revenueStage, setRevenueStage] = useState("");
  const [skills, setSkills] = useState("");

  // Step 3: Needs & Preferences
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lookingFor, setLookingFor] = useState<Challenge[]>([]);
  const [workingStyle, setWorkingStyle] = useState<WorkingStyle | "">("");
  const [meetingFrequency, setMeetingFrequency] = useState<MeetingFrequency | "">("");
  const [timezone, setTimezone] = useState("");

  // Step 4: Media & Links
  const [website, setWebsite] = useState("");
  const [pitchDeckUrl, setPitchDeckUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [documents, setDocuments] = useState<{ name: string; url: string }[]>([]);
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");

  function toggleChallenge(c: Challenge) {
    setChallenges((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : prev.length < 3 ? [...prev, c] : prev
    );
  }

  function toggleLookingFor(c: Challenge) {
    setLookingFor((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : prev.length < 3 ? [...prev, c] : prev
    );
  }

  function addDocument() {
    if (docName && docUrl) {
      setDocuments((prev) => [...prev, { name: docName, url: docUrl }]);
      setDocName("");
      setDocUrl("");
    }
  }

  function handleSubmit() {
    const founderProfile: Founder = {
      id: `f-${Date.now()}`,
      name,
      avatar: "",
      contacts: {
        email,
        phone: phone || undefined,
        linkedin: linkedin || undefined,
        twitter: twitter || undefined,
        website: website || undefined,
      },
      company,
      one_liner: oneLiner,
      bio,
      stage: stage as StartupStage,
      industry: industry as Industry,
      business_model: businessModel as BusinessModel,
      team_size: parseInt(teamSize) || 1,
      team_composition: (teamComposition as "technical" | "business" | "mixed") || "mixed",
      challenges,
      looking_for: lookingFor,
      working_style: (workingStyle as WorkingStyle) || "balanced",
      meeting_frequency: (meetingFrequency as MeetingFrequency) || "biweekly",
      timezone: timezone || "America/Mexico_City",
      location: location || "",
      languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
      funding_raised: fundingRaised || undefined,
      revenue_stage: (revenueStage as any) || undefined,
      pitch_deck_url: pitchDeckUrl || undefined,
      video_url: videoUrl || undefined,
      documents: documents.length > 0 ? documents : undefined,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    };

    // Save to dynamic store (appears in directory + AI + matching)
    addFounder(founderProfile);

    // Save as logged-in user
    localStorage.setItem("lemons_user", JSON.stringify({ ...founderProfile, type: "founder" }));

    router.push("/match/results");
  }

  const canProceed = () => {
    switch (step) {
      case 0: return name && email && password;
      case 1: return company && stage && industry && businessModel && teamComposition;
      case 2: return challenges.length > 0 && lookingFor.length > 0 && workingStyle && meetingFrequency;
      case 3: return true; // Media is optional
      default: return true;
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-xs sm:block ${i === step ? "font-medium" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
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
                  <Label>Full Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@startup.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+52-55-1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/you" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@yourhandle" />
              </div>
            </>
          )}

          {/* Step 2: Company Details */}
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your startup" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mexico City, Mexico" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>One-Liner</Label>
                <Input value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="What does your startup do in one sentence?" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself and your startup..." rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Stage *</Label>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Business Model *</Label>
                  <Select value={businessModel} onValueChange={(v) => setBusinessModel((v ?? "") as BusinessModel | "")}>
                    <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(businessModelLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team Composition *</Label>
                  <Select value={teamComposition} onValueChange={(v) => setTeamComposition((v ?? "") as "technical" | "business" | "mixed" | "")}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Mostly Technical</SelectItem>
                      <SelectItem value="business">Mostly Business</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Input type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label>Funding Raised</Label>
                  <Input value={fundingRaised} onChange={(e) => setFundingRaised(e.target.value)} placeholder="$500K" />
                </div>
                <div className="space-y-2">
                  <Label>Revenue Stage</Label>
                  <Select value={revenueStage} onValueChange={(v) => setRevenueStage(v ?? "")}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {REVENUE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Languages (comma-separated)</Label>
                  <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Spanish" />
                </div>
                <div className="space-y-2">
                  <Label>Skills / Tags (comma-separated)</Label>
                  <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="AI/ML, fintech, product" />
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
                    <Badge key={k} variant={challenges.includes(k as Challenge) ? "default" : "outline"} className="cursor-pointer transition-colors" onClick={() => toggleChallenge(k as Challenge)}>{v}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>What are you looking for in a mentor? (select up to 3) *</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(challengeLabels).map(([k, v]) => (
                    <Badge key={k} variant={lookingFor.includes(k as Challenge) ? "default" : "outline"} className="cursor-pointer transition-colors" onClick={() => toggleLookingFor(k as Challenge)}>{v}</Badge>
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
                <Label>Timezone</Label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. America/Mexico_City" />
              </div>
            </>
          )}

          {/* Step 4: Media & Links */}
          {step === 3 && (
            <>
              <p className="text-sm text-muted-foreground">
                Share materials that help mentors understand your project. All fields are optional.
              </p>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> Website</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourstartup.com" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Upload className="h-4 w-4" /> Pitch Deck URL</Label>
                <Input value={pitchDeckUrl} onChange={(e) => setPitchDeckUrl(e.target.value)} placeholder="https://pitch.com/your-deck or Google Slides link" />
                <p className="text-xs text-muted-foreground">Link to your pitch deck (Google Slides, Pitch, Canva, etc.)</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Video className="h-4 w-4" /> Video Pitch URL</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... or Loom link" />
                <p className="text-xs text-muted-foreground">A short video (1-3 min) explaining your project</p>
              </div>
              <div className="space-y-3">
                <Label>Additional Documents</Label>
                <div className="flex gap-2">
                  <Input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Document name" className="flex-1" />
                  <Input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="URL" className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={addDocument} disabled={!docName || !docUrl}>Add</Button>
                </div>
                {documents.length > 0 && (
                  <div className="space-y-1">
                    {documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between rounded bg-muted/50 px-3 py-1.5 text-sm">
                        <span>{doc.name}</span>
                        <button onClick={() => setDocuments((prev) => prev.filter((_, j) => j !== i))} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 5: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><span className="font-medium">Name:</span> {name}</div>
                  <div><span className="font-medium">Email:</span> {email}</div>
                  <div><span className="font-medium">Company:</span> {company}</div>
                  <div><span className="font-medium">Location:</span> {location || "—"}</div>
                  <div><span className="font-medium">Stage:</span> {stage ? stageLabels[stage as StartupStage] : "—"}</div>
                  <div><span className="font-medium">Industry:</span> {industry ? industryLabels[industry as Industry] : "—"}</div>
                  <div><span className="font-medium">Model:</span> {businessModel ? businessModelLabels[businessModel as BusinessModel] : "—"}</div>
                  <div><span className="font-medium">Team:</span> {teamSize || "—"} ({teamComposition || "—"})</div>
                  <div><span className="font-medium">Funding:</span> {fundingRaised || "—"}</div>
                  <div><span className="font-medium">Revenue:</span> {revenueStage || "—"}</div>
                </div>
                {oneLiner && <div><span className="font-medium">One-liner:</span> {oneLiner}</div>}
                {linkedin && <div><span className="font-medium">LinkedIn:</span> {linkedin}</div>}
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-medium">Challenges:</span>
                  {challenges.map((c) => <Badge key={c} variant="secondary" className="text-xs">{challengeLabels[c]}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-medium">Looking for:</span>
                  {lookingFor.map((c) => <Badge key={c} variant="outline" className="text-xs">{challengeLabels[c]}</Badge>)}
                </div>
                {pitchDeckUrl && <div><span className="font-medium">Pitch Deck:</span> {pitchDeckUrl}</div>}
                {videoUrl && <div><span className="font-medium">Video:</span> {videoUrl}</div>}
                {documents.length > 0 && <div><span className="font-medium">Documents:</span> {documents.map((d) => d.name).join(", ")}</div>}
              </div>
              <p className="text-sm text-muted-foreground">
                Your profile will appear in the network directory and be used for AI-powered matching.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()} className="gap-1">
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
