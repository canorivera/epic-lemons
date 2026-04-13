"use client";

import { useMemo, useState, useCallback } from "react";
import type { Industry } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NetworkNode {
  id: string;
  name: string;
  role?: string;
  industries: Industry[];
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  onNodeClick?: (id: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Deterministic hash & helpers
// ---------------------------------------------------------------------------

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Seeded pseudo-random (mulberry32) - returns values in [0,1). */
function seededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Industry color mapping - green-adjacent palette
const INDUSTRY_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  fintech:       { bg: "bg-emerald-500/80",  text: "text-white",      glow: "shadow-emerald-500/30" },
  healthtech:    { bg: "bg-teal-500/80",     text: "text-white",      glow: "shadow-teal-500/30" },
  edtech:        { bg: "bg-cyan-600/80",     text: "text-white",      glow: "shadow-cyan-600/30" },
  climate:       { bg: "bg-green-500/80",    text: "text-white",      glow: "shadow-green-500/30" },
  saas:          { bg: "bg-emerald-600/80",  text: "text-white",      glow: "shadow-emerald-600/30" },
  marketplace:   { bg: "bg-lime-600/80",     text: "text-white",      glow: "shadow-lime-600/30" },
  "ai-ml":       { bg: "bg-teal-600/80",     text: "text-white",      glow: "shadow-teal-600/30" },
  biotech:       { bg: "bg-green-600/80",    text: "text-white",      glow: "shadow-green-600/30" },
  ecommerce:     { bg: "bg-emerald-400/80",  text: "text-emerald-950", glow: "shadow-emerald-400/30" },
  deeptech:      { bg: "bg-cyan-700/80",     text: "text-white",      glow: "shadow-cyan-700/30" },
  "social-impact": { bg: "bg-green-400/80",  text: "text-green-950",  glow: "shadow-green-400/30" },
  logistics:     { bg: "bg-teal-400/80",     text: "text-teal-950",   glow: "shadow-teal-400/30" },
  proptech:      { bg: "bg-emerald-700/80",  text: "text-white",      glow: "shadow-emerald-700/30" },
  gaming:        { bg: "bg-lime-500/80",     text: "text-lime-950",   glow: "shadow-lime-500/30" },
  cybersecurity: { bg: "bg-green-700/80",    text: "text-white",      glow: "shadow-green-700/30" },
};

const DEFAULT_COLOR = { bg: "bg-emerald-500/80", text: "text-white", glow: "shadow-emerald-500/30" };

function industryColor(industry: string) {
  return INDUSTRY_COLORS[industry] ?? DEFAULT_COLOR;
}

// ---------------------------------------------------------------------------
// Position & connection computation
// ---------------------------------------------------------------------------

interface PositionedNode {
  id: string;
  name: string;
  role?: string;
  industries: Industry[];
  x: number; // percent 0-100
  y: number; // percent 0-100
  size: number; // px
  animDelay: number; // seconds
  color: { bg: string; text: string; glow: string };
}

interface Connection {
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  shared: number; // number of shared industries
}

function computeLayout(nodes: NetworkNode[]) {
  const positioned: PositionedNode[] = [];
  const PADDING = 8; // percent from edges
  const MIN_DIST = 10; // minimum distance between nodes (percent)

  for (const node of nodes) {
    const rng = seededRandom(hashStr(node.id + node.name));

    // Base size from industry count
    const size = 40 + Math.min(node.industries.length, 5) * 6;

    // Generate position with collision avoidance (simple repulsion)
    let bestX = PADDING + rng() * (100 - 2 * PADDING);
    let bestY = PADDING + rng() * (100 - 2 * PADDING);

    // Try a few times to avoid overlap
    for (let attempt = 0; attempt < 15; attempt++) {
      let tooClose = false;
      for (const placed of positioned) {
        const dx = bestX - placed.x;
        const dy = bestY - placed.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) break;
      bestX = PADDING + rng() * (100 - 2 * PADDING);
      bestY = PADDING + rng() * (100 - 2 * PADDING);
    }

    const primaryIndustry = node.industries[0] ?? "fintech";
    positioned.push({
      ...node,
      x: bestX,
      y: bestY,
      size,
      animDelay: rng() * 6,
      color: industryColor(primaryIndustry),
    });
  }

  // Compute connections (shared industries)
  const connections: Connection[] = [];
  for (let i = 0; i < positioned.length; i++) {
    for (let j = i + 1; j < positioned.length; j++) {
      const a = positioned[i];
      const b = positioned[j];
      const shared = a.industries.filter((ind) =>
        b.industries.includes(ind)
      ).length;
      if (shared > 0) {
        connections.push({
          fromId: a.id,
          toId: b.id,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          shared,
        });
      }
    }
  }

  return { positioned, connections };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NetworkGraph({
  nodes,
  onNodeClick,
  className,
}: NetworkGraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { positioned, connections } = useMemo(
    () => computeLayout(nodes),
    [nodes]
  );

  const handleClick = useCallback(
    (id: string) => {
      onNodeClick?.(id);
    },
    [onNodeClick]
  );

  // Connections relevant to hovered node
  const activeConnections = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const set = new Set<string>();
    for (const c of connections) {
      if (c.fromId === hoveredId || c.toId === hoveredId) {
        set.add(c.fromId);
        set.add(c.toId);
      }
    }
    return set;
  }, [hoveredId, connections]);

  if (nodes.length === 0) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-950 to-teal-950 text-emerald-300/60 text-sm ${className ?? ""}`}
      >
        No people to display
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-950 via-[#0a2018] to-teal-950 ${className ?? ""}`}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* SVG connection lines */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {connections.map((c) => {
          const isActive =
            hoveredId !== null &&
            (c.fromId === hoveredId || c.toId === hoveredId);
          const opacity = hoveredId
            ? isActive
              ? 0.4
              : 0.04
            : 0.08 + Math.min(c.shared, 3) * 0.03;

          return (
            <line
              key={`${c.fromId}-${c.toId}`}
              x1={`${c.x1}%`}
              y1={`${c.y1}%`}
              x2={`${c.x2}%`}
              y2={`${c.y2}%`}
              stroke={isActive ? "#6ee7b7" : "#6ee7b7"}
              strokeWidth={isActive ? 0.3 : 0.15}
              strokeOpacity={opacity}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {positioned.map((node) => {
        const isHovered = hoveredId === node.id;
        const isConnected = activeConnections.has(node.id);
        const dimmed = hoveredId !== null && !isHovered && !isConnected;

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Floating animation wrapper */}
            <div
              className="relative"
              style={{
                animation: `networkFloat 6s ease-in-out ${node.animDelay}s infinite`,
              }}
            >
              {/* Glow ring on hover */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isHovered
                    ? `scale-150 ${node.color.glow} shadow-[0_0_20px_4px] opacity-60`
                    : "scale-100 opacity-0"
                }`}
              />

              {/* The bubble */}
              <button
                type="button"
                onClick={() => handleClick(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative flex items-center justify-center rounded-full
                  border border-white/10 backdrop-blur-sm
                  font-semibold select-none
                  transition-all duration-300 cursor-pointer
                  ${node.color.bg} ${node.color.text}
                  ${dimmed ? "opacity-30 scale-90" : "opacity-90"}
                  ${isHovered ? "scale-125 opacity-100 z-20 shadow-lg" : ""}
                  hover:opacity-100
                `}
                style={{
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                  fontSize: `${Math.max(10, node.size * 0.28)}px`,
                }}
                aria-label={`${node.name}${node.role ? `, ${node.role}` : ""}`}
              >
                {initials(node.name)}
              </button>

              {/* Tooltip */}
              <div
                className={`
                  pointer-events-none absolute left-1/2 -translate-x-1/2
                  whitespace-nowrap rounded-md
                  bg-black/80 px-2.5 py-1.5 text-xs text-white
                  backdrop-blur-sm border border-white/10
                  transition-all duration-200 z-30
                  ${
                    isHovered
                      ? "opacity-100 -translate-y-2 visible"
                      : "opacity-0 translate-y-0 invisible"
                  }
                `}
                style={{ bottom: `${node.size / 2 + 12}px` }}
              >
                <p className="font-medium">{node.name}</p>
                {node.role && (
                  <p className="text-[10px] text-white/60">{node.role}</p>
                )}
                <p className="text-[10px] text-emerald-300/80 mt-0.5">
                  {node.industries
                    .map((i) =>
                      i
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    )
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* CSS keyframes injected via style tag */}
      <style>{`
        @keyframes networkFloat {
          0%, 100% { transform: translateY(0px); }
          33% { transform: translateY(-4px) translateX(2px); }
          66% { transform: translateY(2px) translateX(-2px); }
        }
      `}</style>
    </div>
  );
}
