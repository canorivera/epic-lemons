"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import { FounderCard } from "@/components/person-card";
import { NetworkGraph } from "@/components/network-graph";
import type { NetworkNode } from "@/components/network-graph";
import { getAllFounders } from "@/lib/store";
import type { Industry, StartupStage, Founder } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_INDUSTRIES: Industry[] = [
  "fintech",
  "healthtech",
  "edtech",
  "climate",
  "saas",
  "marketplace",
  "ai-ml",
  "biotech",
  "ecommerce",
  "deeptech",
  "social-impact",
  "logistics",
  "proptech",
  "gaming",
  "cybersecurity",
];

const ALL_STAGES: StartupStage[] = [
  "idea",
  "pre-seed",
  "seed",
  "series-a",
  "series-b+",
];

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  useEffect(() => { setFounders(getAllFounders()); }, []);

  // Filter state
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Ref for the directory grid so we can scroll to a card on node click
  const directoryRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("network");

  // ------ Network nodes ------
  const networkNodes: NetworkNode[] = useMemo(
    () =>
      founders.map((f) => ({
        id: f.id,
        name: f.name,
        role: `${f.company} — ${f.one_liner}`,
        industries: [f.industry],
      })),
    [founders]
  );

  const handleNodeClick = useCallback(
    (id: string) => {
      // Switch to directory tab and scroll to the card
      setActiveTab("directory");
      // Use a small timeout so the tab content renders before we scroll
      setTimeout(() => {
        const el = document.getElementById(`founder-card-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Brief highlight effect
          el.classList.add("ring-2", "ring-primary");
          setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 2000);
        }
      }, 100);
    },
    []
  );

  // ------ Filtered founders for Directory tab ------
  const filteredFounders = useMemo(() => {
    return founders.filter((f) => {
      // Industry filter
      if (industryFilter !== "all" && f.industry !== industryFilter) return false;

      // Stage filter
      if (stageFilter !== "all" && f.stage !== stageFilter) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${f.name} ${f.company} ${f.one_liner}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [founders, search, industryFilter, stageFilter]);

  // ------ Unique industries & stages present in data (for filter options) ------
  const presentIndustries = useMemo(() => {
    const set = new Set(founders.map((f) => f.industry));
    return ALL_INDUSTRIES.filter((i) => set.has(i));
  }, [founders]);

  const presentStages = useMemo(() => {
    const set = new Set(founders.map((f) => f.stage));
    return ALL_STAGES.filter((s) => set.has(s));
  }, [founders]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Our Founder Community
          </h1>
          <Badge variant="secondary" className="text-sm">
            {founders.length} founders
          </Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          A diverse and ambitious network of founders building the next
          generation of transformative companies. Connect, collaborate, and grow
          together.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs */}
      {/* ------------------------------------------------------------------ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="network">Network View</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        {/* ---- Network View ---- */}
        <TabsContent value="network" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Hover over a node to see connections. Click a node to jump to their
            profile in the Directory tab.
          </p>
          <NetworkGraph
            nodes={networkNodes}
            onNodeClick={handleNodeClick}
            className="h-[500px] md:h-[600px]"
          />
        </TabsContent>

        {/* ---- Directory ---- */}
        <TabsContent value="directory" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Search by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />

            <Select value={industryFilter} onValueChange={(v) => setIndustryFilter(v ?? "all")}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {presentIndustries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {formatLabel(ind)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stageFilter} onValueChange={(v) => setStageFilter(v ?? "all")}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {presentStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {formatLabel(stage)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active filter count */}
            {(industryFilter !== "all" ||
              stageFilter !== "all" ||
              search.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setIndustryFilter("all");
                  setStageFilter("all");
                }}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredFounders.length} of {founders.length} founders
          </p>

          {/* Grid */}
          <div
            ref={directoryRef}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredFounders.map((founder) => (
              <div key={founder.id} id={`founder-card-${founder.id}`}>
                <FounderCard founder={founder} />
              </div>
            ))}
          </div>

          {filteredFounders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">
                No founders match your current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setIndustryFilter("all");
                  setStageFilter("all");
                }}
                className="mt-2 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Reset all filters
              </button>
            </div>
          )}
        </TabsContent>

        {/* ---- AI Assistant ---- */}
        <TabsContent value="ai">
          <AIChatPanel type="founders" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
