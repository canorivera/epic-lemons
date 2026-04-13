"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, GraduationCap } from "lucide-react";
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
  expertiseLabels,
  workingStyleLabels,
  meetingFrequencyLabels,
  motivationLabels,
} from "@/lib/questionnaire-options";
import type {
  StartupStage,
  Industry,
  ExpertiseArea,
  WorkingStyle,
  MeetingFrequency,
  MentorMotivation,
} from "@/lib/types";

const STEPS = ["Basic Info", "Expertise", "Preferences", "Review"];

export default function MentorSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");

  // Step 2
  const [yearsExp, setYearsExp] = useState("");
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [expertise, setExpertise] = useState<ExpertiseArea[]>([]);
  const [preferredStages, setPreferredStages] = useState<StartupStage[]>([]);

  // Step 3
  const [maxMentees, setMaxMentees] = useState("3");
  const [motivation, setMotivation] = useState<MentorMotivation[]>([]);
  const [looksForInFounders, setLooksForInFounders] = useState("");
  const [workingStyle, setWorkingStyle] = useState<WorkingStyle | "">("");
  const [meetingFrequency, setMeetingFrequency] = useState<MeetingFrequency | "">("");
  const [timezone, setTimezone] = useState("");

  function toggleItem<T>(arr: T[], setArr: (v: T[]) => void, item: T, max = 5) {
    setArr(
      arr.includes(item) ? arr.filter((x) => x !== item) : arr.length < max ? [...arr, item] : arr
    );
  }

  function handleSubmit() {
    const mentorProfile = {
      type: "mentor",
      id: `m-${Date.now()}`,
      name,
      email,
      current_role: currentRole,
      company,
      bio,
      years_experience: parseInt(yearsExp) || 0,
      industries,
      expertise,
      preferred_stages: preferredStages,
      max_mentees: parseInt(maxMentees) || 3,
      motivation,
      looks_for_in_founders: looksForInFounders.split(",").map((s) => s.trim()).filter(Boolean),
      working_style: workingStyle,
      meeting_frequency: meetingFrequency,
      timezone,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("lemons_user", JSON.stringify(mentorProfile));
    router.push("/dashboard");
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return name && email && password && currentRole && company;
      case 1:
        return yearsExp && industries.length > 0 && expertise.length > 0;
      case 2:
        return workingStyle && meetingFrequency;
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
                  i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
          <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {STEPS[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Current Role *</Label>
                  <Input id="role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="VP of Engineering" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell founders about your background and what drives you..." rows={3} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="years">Years of Experience *</Label>
                <Input id="years" type="number" min="1" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} placeholder="e.g. 15" />
              </div>
              <div className="space-y-3">
                <Label>Industries (select all that apply) *</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(industryLabels).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant={industries.includes(k as Industry) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleItem(industries, setIndustries, k as Industry, 6)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Areas of Expertise (select all that apply) *</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(expertiseLabels).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant={expertise.includes(k as ExpertiseArea) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleItem(expertise, setExpertise, k as ExpertiseArea, 6)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Preferred Startup Stages</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stageLabels).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant={preferredStages.includes(k as StartupStage) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleItem(preferredStages, setPreferredStages, k as StartupStage)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="maxMentees">Max Founders You Can Mentor Simultaneously</Label>
                <Input id="maxMentees" type="number" min="1" max="10" value={maxMentees} onChange={(e) => setMaxMentees(e.target.value)} />
              </div>
              <div className="space-y-3">
                <Label>Motivation (select all that apply)</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(motivationLabels).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant={motivation.includes(k as MentorMotivation) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleItem(motivation, setMotivation, k as MentorMotivation)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="looksFor">What do you look for in founders? (comma-separated)</Label>
                <Input id="looksFor" value={looksForInFounders} onChange={(e) => setLooksForInFounders(e.target.value)} placeholder="coachability, grit, market insight" />
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
                <Label htmlFor="tz">Timezone</Label>
                <Input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. America/Mexico_City" />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><span className="font-medium">Name:</span> {name}</div>
                  <div><span className="font-medium">Email:</span> {email}</div>
                  <div><span className="font-medium">Role:</span> {currentRole}</div>
                  <div><span className="font-medium">Company:</span> {company}</div>
                  <div><span className="font-medium">Experience:</span> {yearsExp} years</div>
                  <div><span className="font-medium">Max Mentees:</span> {maxMentees}</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-medium">Industries:</span>
                  {industries.map((i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{industryLabels[i]}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-medium">Expertise:</span>
                  {expertise.map((e) => (
                    <Badge key={e} variant="outline" className="text-xs">{expertiseLabels[e]}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                By joining, you&apos;ll appear in our mentor network and founders will be able to request sessions with you.
              </p>
            </div>
          )}

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
                <Check className="h-4 w-4" /> Join as Mentor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
