"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, Users, Network, BookOpen, Bot } from "lucide-react";
import { AIChatPanel } from "@/components/ai-chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MentorCard } from "@/components/person-card";
import { NetworkGraph } from "@/components/network-graph";
import type { NetworkNode } from "@/components/network-graph";
import { getAllMentors } from "@/lib/store";
import type { Industry, ExpertiseArea, Mentor } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MentorsPage() {
  // --- Dynamic data ---
  const [mentors, setMentors] = useState<Mentor[]>([]);
  useEffect(() => { setMentors(getAllMentors()); }, []);

  // --- Filter state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [expertiseFilter, setExpertiseFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<number>(0);

  // Ref to the directory section so we can scroll to a card
  const directoryRef = useRef<HTMLDivElement>(null);

  const ALL_INDUSTRIES: Industry[] = useMemo(() => Array.from(new Set(mentors.flatMap((m) => m.industries))).sort() as Industry[], [mentors]);
  const ALL_EXPERTISE: ExpertiseArea[] = useMemo(() => Array.from(new Set(mentors.flatMap((m) => m.expertise))).sort() as ExpertiseArea[], [mentors]);

  // --- Network nodes ---
  const networkNodes: NetworkNode[] = useMemo(
    () =>
      mentors.map((m) => ({
        id: m.id,
        name: m.name,
        role: `${m.current_role} at ${m.company}`,
        industries: m.industries,
      })),
    [mentors]
  );

  // --- Filtered mentors ---
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      // Search by name
      if (
        searchQuery &&
        !m.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Filter by industry
      if (
        industryFilter !== "all" &&
        !m.industries.includes(industryFilter as Industry)
      ) {
        return false;
      }
      // Filter by expertise
      if (
        expertiseFilter !== "all" &&
        !m.expertise.includes(expertiseFilter as ExpertiseArea)
      ) {
        return false;
      }
      return true;
    });
  }, [mentors, searchQuery, industryFilter, expertiseFilter]);

  // --- Scroll to mentor card in directory on node click ---
  const handleNodeClick = useCallback(
    (id: string) => {
      // Switch to Directory tab
      setActiveTab(1);

      // Wait for the tab to render, then scroll to the card
      requestAnimationFrame(() => {
        const cardEl = document.getElementById(`mentor-card-${id}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
          // Brief highlight effect
          cardEl.classList.add("ring-2", "ring-primary", "ring-offset-2");
          setTimeout(() => {
            cardEl.classList.remove("ring-2", "ring-primary", "ring-offset-2");
          }, 2000);
        }
      });
    },
    []
  );

  // Active filter count
  const activeFilterCount = [
    industryFilter !== "all",
    expertiseFilter !== "all",
    searchQuery.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 right-0 -z-0 h-[400px] w-[400px] rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge
                variant="outline"
                className="mb-3 gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
              >
                <Network className="h-3 w-3" />
                Mentor Network
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Our Mentor Network
              </h1>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                A curated network of experienced operators, investors, and
                industry leaders dedicated to helping founders succeed. Every
                mentor is vetted for quality, expertise, and commitment.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-3 shadow-sm">
              <Users className="h-5 w-5 text-primary" />
              <div className="text-right">
                <p className="text-2xl font-bold leading-none text-foreground">
                  {mentors.length}
                </p>
                <p className="text-xs text-muted-foreground">Active Mentors</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tabs ── */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as number)}
        >
          <TabsList className="mb-6">
            <TabsTrigger value={0} className="gap-1.5">
              <Network className="h-4 w-4" />
              Network View
            </TabsTrigger>
            <TabsTrigger value={1} className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              Directory
            </TabsTrigger>
            <TabsTrigger value={2} className="gap-1.5">
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* ── Network View Tab ── */}
          <TabsContent value={0}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Hover over nodes to see connections. Click a node to view
                  their profile in the directory.
                </p>
                <Badge variant="secondary" className="text-xs">
                  {networkNodes.length} mentors
                </Badge>
              </div>
              <NetworkGraph
                nodes={networkNodes}
                onNodeClick={handleNodeClick}
                className="h-[500px] md:h-[600px]"
              />
            </div>
          </TabsContent>

          {/* ── Directory Tab ── */}
          <TabsContent value={1}>
            <div ref={directoryRef} className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Industry filter */}
                <Select
                  value={industryFilter}
                  onValueChange={(val) => setIndustryFilter((val as string) ?? "all")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {ALL_INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {formatLabel(ind)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Expertise filter */}
                <Select
                  value={expertiseFilter}
                  onValueChange={(val) => setExpertiseFilter((val as string) ?? "all")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>
                    {ALL_EXPERTISE.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {formatLabel(exp)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIndustryFilter("all");
                      setExpertiseFilter("all");
                    }}
                    className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Results count */}
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredMentors.length}
                  </span>{" "}
                  of {mentors.length} mentors
                </p>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                    active
                  </Badge>
                )}
              </div>

              {/* Mentor cards grid */}
              {filteredMentors.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      id={`mentor-card-${mentor.id}`}
                      className="transition-all duration-300 rounded-xl"
                    >
                      <MentorCard mentor={mentor} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 py-16 text-center">
                  <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-lg font-medium text-foreground">
                    No mentors found
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your search or filters to find what you are
                    looking for.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIndustryFilter("all");
                      setExpertiseFilter("all");
                    }}
                    className="mt-4 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── AI Assistant Tab ── */}
          <TabsContent value={2}>
            <AIChatPanel type="mentors" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
