"use client";

import { useMemo } from "react";
import type { Mentor, Founder, Industry, StartupStage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Mail,
  Phone,
  Link2,
  AtSign,
  Globe,
  Languages,
  Trophy,
  Building2,
  DollarSign,
  FileText,
  Video,
  ExternalLink,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GREEN_PALETTE = [
  "bg-emerald-700",
  "bg-emerald-600",
  "bg-teal-700",
  "bg-teal-600",
  "bg-green-700",
  "bg-green-600",
  "bg-lime-700",
  "bg-cyan-700",
  "bg-emerald-800",
  "bg-green-800",
] as const;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function avatarColor(name: string) {
  return GREEN_PALETTE[hashName(name) % GREEN_PALETTE.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && half
                ? "fill-amber-400/50 text-amber-400"
                : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function StageBadge({ stage }: { stage: StartupStage }) {
  const colors: Record<StartupStage, string> = {
    idea: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "pre-seed":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    seed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "series-a":
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "series-b+":
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[stage]}`}
    >
      {formatLabel(stage)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// PersonAvatar (shared)
// ---------------------------------------------------------------------------

function PersonAvatar({
  name,
  size = "default",
  className,
}: {
  name: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const bg = avatarColor(name);
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={`${bg} text-white font-semibold`}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

// ---------------------------------------------------------------------------
// MentorCard
// ---------------------------------------------------------------------------

export function MentorCard({ mentor }: { mentor: Mentor }) {
  const industryBadges = useMemo(
    () => mentor.industries.slice(0, 3),
    [mentor.industries]
  );
  const expertiseBadges = useMemo(
    () => mentor.expertise.slice(0, 3),
    [mentor.expertise]
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Card className="cursor-pointer transition-shadow hover:shadow-md hover:ring-primary/30 hover:ring-2" />
        }
      >
        <CardHeader>
          <div className="flex items-start gap-3">
            <PersonAvatar name={mentor.name} size="lg" />
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">{mentor.name}</CardTitle>
              <p className="text-xs text-muted-foreground truncate">
                {mentor.current_role} at {mentor.company}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Bio */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {mentor.bio}
          </p>

          {/* Industries */}
          <div className="flex flex-wrap gap-1">
            {industryBadges.map((ind) => (
              <Badge key={ind} variant="secondary" className="text-[10px]">
                {formatLabel(ind)}
              </Badge>
            ))}
            {mentor.industries.length > 3 && (
              <Badge variant="secondary" className="text-[10px]">
                +{mentor.industries.length - 3}
              </Badge>
            )}
          </div>

          {/* Expertise */}
          <div className="flex flex-wrap gap-1">
            {expertiseBadges.map((exp) => (
              <Badge key={exp} variant="outline" className="text-[10px]">
                {formatLabel(exp)}
              </Badge>
            ))}
            {mentor.expertise.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{mentor.expertise.length - 3}
              </Badge>
            )}
          </div>

          {/* Rating + Sessions */}
          <div className="flex items-center justify-between pt-1">
            <StarRating rating={mentor.avg_rating} />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3" />
              {mentor.sessions_completed}
            </span>
          </div>
        </CardContent>
      </DialogTrigger>

      {/* ---- Full Profile Dialog ---- */}
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <PersonAvatar name={mentor.name} size="lg" />
            <div>
              <DialogTitle>{mentor.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {mentor.current_role} at {mentor.company}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Bio */}
        <p className="text-sm leading-relaxed">{mentor.bio}</p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-3" />
            {mentor.years_experience} years
          </span>
          {mentor.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {mentor.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {formatLabel(mentor.meeting_frequency)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" />
            {mentor.current_mentees}/{mentor.max_mentees} mentees
          </span>
          {mentor.languages?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Languages className="size-3" />
              {mentor.languages.join(", ")}
            </span>
          )}
        </div>

        {/* Contact Info */}
        {mentor.contacts && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Contact</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
              {mentor.contacts.email && (
                <a href={`mailto:${mentor.contacts.email}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <Mail className="size-3" /> {mentor.contacts.email}
                </a>
              )}
              {mentor.contacts.phone && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Phone className="size-3" /> {mentor.contacts.phone}
                </span>
              )}
              {mentor.contacts.linkedin && (
                <a href={mentor.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <Link2 className="size-3" /> LinkedIn
                </a>
              )}
              {mentor.contacts.twitter && (
                <a href={`https://x.com/${mentor.contacts.twitter.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <AtSign className="size-3" /> {mentor.contacts.twitter}
                </a>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Industries */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Industries
          </h4>
          <div className="flex flex-wrap gap-1">
            {mentor.industries.map((ind) => (
              <Badge key={ind} variant="secondary" className="text-[10px]">
                {formatLabel(ind)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expertise */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Expertise
          </h4>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.map((exp) => (
              <Badge key={exp} variant="outline" className="text-[10px]">
                {formatLabel(exp)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills */}
        {mentor.skills?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {mentor.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Stages */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Preferred Stages
          </h4>
          <div className="flex flex-wrap gap-1">
            {mentor.preferred_stages.map((stage) => (
              <StageBadge key={stage} stage={stage} />
            ))}
          </div>
        </div>

        {/* What they look for */}
        {mentor.looks_for_in_founders.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
              Looks For in Founders
            </h4>
            <ul className="list-disc list-inside text-sm space-y-0.5">
              {mentor.looks_for_in_founders.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notable Achievements */}
        {mentor.notable_achievements && mentor.notable_achievements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <Trophy className="size-3" /> Notable Achievements
            </h4>
            <ul className="list-disc list-inside text-sm space-y-0.5">
              {mentor.notable_achievements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Portfolio Companies */}
        {mentor.portfolio_companies && mentor.portfolio_companies.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <Building2 className="size-3" /> Portfolio Companies
            </h4>
            <div className="flex flex-wrap gap-1">
              {mentor.portfolio_companies.map((co) => (
                <Badge key={co} variant="outline" className="text-[10px]">
                  {co}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rating + Sessions */}
        <Separator />
        <div className="flex items-center justify-between">
          <StarRating rating={mentor.avg_rating} />
          <span className="text-xs text-muted-foreground">
            {mentor.sessions_completed} sessions completed
          </span>
        </div>

        {/* Calendly */}
        {mentor.calendly_url && (
          <div className="flex gap-3 text-xs">
            <a
              href={mentor.calendly_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80"
            >
              <ExternalLink className="size-3" /> Book a session
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// FounderCard
// ---------------------------------------------------------------------------

export function FounderCard({ founder }: { founder: Founder }) {
  const challengeBadges = useMemo(
    () => founder.challenges.slice(0, 3),
    [founder.challenges]
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Card className="cursor-pointer transition-shadow hover:shadow-md hover:ring-primary/30 hover:ring-2" />
        }
      >
        <CardHeader>
          <div className="flex items-start gap-3">
            <PersonAvatar name={founder.name} size="lg" />
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">{founder.name}</CardTitle>
              <p className="text-xs text-muted-foreground truncate">
                {founder.company}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* One-liner */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {founder.one_liner}
          </p>

          {/* Stage + Industry */}
          <div className="flex flex-wrap gap-1">
            <StageBadge stage={founder.stage} />
            <Badge variant="secondary" className="text-[10px]">
              {formatLabel(founder.industry)}
            </Badge>
          </div>

          {/* Challenges */}
          <div className="flex flex-wrap gap-1">
            {challengeBadges.map((ch) => (
              <Badge key={ch} variant="outline" className="text-[10px]">
                {formatLabel(ch)}
              </Badge>
            ))}
            {founder.challenges.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{founder.challenges.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </DialogTrigger>

      {/* ---- Full Profile Dialog ---- */}
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <PersonAvatar name={founder.name} size="lg" />
            <div>
              <DialogTitle>{founder.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {founder.company}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* One-liner */}
        <p className="text-sm font-medium">{founder.one_liner}</p>

        {/* Bio */}
        <p className="text-sm leading-relaxed">{founder.bio}</p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-3" />
            {formatLabel(founder.business_model)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" />
            Team of {founder.team_size} ({formatLabel(founder.team_composition)})
          </span>
          {founder.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {founder.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {formatLabel(founder.meeting_frequency)}
          </span>
          {founder.languages?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Languages className="size-3" />
              {founder.languages.join(", ")}
            </span>
          )}
        </div>

        {/* Contact Info */}
        {founder.contacts && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Contact</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
              {founder.contacts.email && (
                <a href={`mailto:${founder.contacts.email}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <Mail className="size-3" /> {founder.contacts.email}
                </a>
              )}
              {founder.contacts.phone && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Phone className="size-3" /> {founder.contacts.phone}
                </span>
              )}
              {founder.contacts.linkedin && (
                <a href={founder.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <Link2 className="size-3" /> LinkedIn
                </a>
              )}
              {founder.contacts.twitter && (
                <a href={`https://x.com/${founder.contacts.twitter.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <AtSign className="size-3" /> {founder.contacts.twitter}
                </a>
              )}
              {founder.contacts.website && (
                <a href={founder.contacts.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <Globe className="size-3" /> Website
                </a>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Stage + Industry + Funding */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Stage & Industry
          </h4>
          <div className="flex flex-wrap gap-1.5 items-center">
            <StageBadge stage={founder.stage} />
            <Badge variant="secondary" className="text-[10px]">
              {formatLabel(founder.industry)}
            </Badge>
            {founder.funding_raised && (
              <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <DollarSign className="size-2.5 mr-0.5" /> {founder.funding_raised}
              </Badge>
            )}
            {founder.revenue_stage && (
              <Badge variant="outline" className="text-[10px]">
                {formatLabel(founder.revenue_stage)}
              </Badge>
            )}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Current Challenges
          </h4>
          <div className="flex flex-wrap gap-1">
            {founder.challenges.map((ch) => (
              <Badge key={ch} variant="outline" className="text-[10px]">
                {formatLabel(ch)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Looking For Help With
          </h4>
          <div className="flex flex-wrap gap-1">
            {founder.looking_for.map((item) => (
              <Badge key={item} variant="default" className="text-[10px]">
                {formatLabel(item)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills */}
        {founder.skills?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {founder.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Working Style */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
            Working Style
          </h4>
          <p className="text-sm">{formatLabel(founder.working_style)}</p>
        </div>

        {/* Media & Documents */}
        {(founder.pitch_deck_url || founder.video_url || (founder.documents && founder.documents.length > 0)) && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Media & Documents</h4>
              <div className="flex flex-wrap gap-3 text-xs">
                {founder.pitch_deck_url && (
                  <a href={founder.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                    <FileText className="size-3" /> Pitch Deck
                  </a>
                )}
                {founder.video_url && (
                  <a href={founder.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                    <Video className="size-3" /> Video
                  </a>
                )}
                {founder.documents?.map((doc, i) => (
                  <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                    <FileText className="size-3" /> {doc.name}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
