"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  MessageSquare,
  Users,
  Star,
  TrendingUp,
  BarChart3,
  Shield,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllMentors,
  getAllFounders,
  getAllFeedback,
  getAllSupplyGaps,
} from "@/lib/store";
import type { Mentor, Founder, MatchFeedback, SupplyGap } from "@/lib/types";

function formatLabel(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const ADMIN_EMAIL = "admin@itam.mx";
const ADMIN_PASSWORD = "adminadmin";

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [feedback, setFeedback] = useState<MatchFeedback[]>([]);
  const [gaps, setGaps] = useState<SupplyGap[]>([]);

  useEffect(() => {
    // Check if already authenticated this session
    if (sessionStorage.getItem("lemons_admin") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setMentors(getAllMentors());
    setFounders(getAllFounders());
    setFeedback(getAllFeedback());
    setGaps(getAllSupplyGaps());
  }, [authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem("lemons_admin", "true");
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid email or password.");
    }
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@itam.mx"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              {loginError && (
                <p className="text-xs text-destructive">{loginError}</p>
              )}
              <Button type="submit" className="w-full gap-1.5">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : "—";

  // Aggregate supply gaps by need
  const needCounts: Record<string, number> = {};
  gaps.forEach((g) => {
    g.needs.forEach((n) => {
      needCounts[n] = (needCounts[n] || 0) + 1;
    });
  });
  const sortedNeeds = Object.entries(needCounts).sort((a, b) => b[1] - a[1]);

  // Aggregate supply gaps by industry
  const industryCounts: Record<string, number> = {};
  gaps.forEach((g) => {
    if (g.industry) industryCounts[g.industry] = (industryCounts[g.industry] || 0) + 1;
  });
  const sortedIndustries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]);

  // Mentor capacity utilization
  const totalCapacity = mentors.reduce((s, m) => s + m.max_mentees, 0);
  const totalUsed = mentors.reduce((s, m) => s + m.current_mentees, 0);
  const utilizationPct = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor network health, review feedback, and identify supply gaps.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mentors.length}</p>
              <p className="text-xs text-muted-foreground">Mentors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{founders.length}</p>
              <p className="text-xs text-muted-foreground">Founders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{feedback.length}</p>
              <p className="text-xs text-muted-foreground">Feedback Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgRating}</p>
              <p className="text-xs text-muted-foreground">Avg Match Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{gaps.length}</p>
              <p className="text-xs text-muted-foreground">Supply Gaps</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Mentor Capacity Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-muted">
              <div
                className="h-3 rounded-full bg-primary transition-all"
                style={{ width: `${utilizationPct}%` }}
              />
            </div>
            <span className="text-sm font-medium">{utilizationPct}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalUsed} of {totalCapacity} mentee slots filled
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="gaps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gaps" className="gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Supply Gaps
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> Feedback
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" /> Insights
          </TabsTrigger>
        </TabsList>

        {/* Supply Gaps Tab */}
        <TabsContent value="gaps" className="space-y-4">
          {gaps.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No supply gaps reported yet. When founders can&apos;t find a match,
                their unmet needs will appear here.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {gaps.map((gap) => (
                <Card key={gap.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{gap.founder_name}</p>
                          {gap.founder_email && (
                            <a
                              href={`mailto:${gap.founder_email}`}
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              {gap.founder_email}
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {gap.industry && (
                            <Badge variant="secondary" className="text-[10px]">
                              {formatLabel(gap.industry)}
                            </Badge>
                          )}
                          {gap.stage && (
                            <Badge variant="outline" className="text-[10px]">
                              {formatLabel(gap.stage)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground mr-1">Needs:</span>
                          {gap.needs.map((n) => (
                            <Badge key={n} variant="destructive" className="text-[10px]">
                              {formatLabel(n)}
                            </Badge>
                          ))}
                        </div>
                        {gap.description && (
                          <p className="text-xs text-muted-foreground">{gap.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(gap.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {feedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No feedback submitted yet. Founders can rate match suggestions on
                the results page.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[...feedback].reverse().map((fb) => (
                <Card key={fb.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{fb.founder_name}</p>
                          <span className="text-xs text-muted-foreground">rated</span>
                          <p className="text-sm font-medium">{fb.mentor_name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < fb.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        {fb.comment && (
                          <p className="text-xs text-muted-foreground mt-1">
                            &ldquo;{fb.comment}&rdquo;
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Unmet Needs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top Unmet Needs</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedNeeds.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No data yet</p>
                ) : (
                  <div className="space-y-2">
                    {sortedNeeds.slice(0, 8).map(([need, count]) => (
                      <div key={need} className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-destructive/70"
                            style={{
                              width: `${(count / (sortedNeeds[0]?.[1] || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs w-24 truncate">{formatLabel(need)}</span>
                        <span className="text-xs font-medium w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Underserved Industries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Underserved Industries</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedIndustries.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No data yet</p>
                ) : (
                  <div className="space-y-2">
                    {sortedIndustries.slice(0, 8).map(([ind, count]) => (
                      <div key={ind} className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-amber-500/70"
                            style={{
                              width: `${(count / (sortedIndustries[0]?.[1] || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs w-24 truncate">{formatLabel(ind)}</span>
                        <span className="text-xs font-medium w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No data yet</p>
                ) : (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = feedback.filter((f) => f.rating === star).length;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs w-8 flex items-center gap-0.5">
                            {star} <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{
                                width: feedback.length > 0 ? `${(count / feedback.length) * 100}%` : "0%",
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mentors with Open Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mentors
                    .filter((m) => m.current_mentees < m.max_mentees)
                    .sort((a, b) => (b.max_mentees - b.current_mentees) - (a.max_mentees - a.current_mentees))
                    .slice(0, 6)
                    .map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-xs">
                        <span className="truncate max-w-[180px]">{m.name}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {m.max_mentees - m.current_mentees} open
                        </Badge>
                      </div>
                    ))}
                  {mentors.filter((m) => m.current_mentees < m.max_mentees).length === 0 && (
                    <p className="text-xs text-muted-foreground">All mentors are at capacity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
