"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Trophy,
  Calendar,
  Star,
  ArrowRight,
  Citrus,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mentors, founders } from "@/lib/data";

interface UserProfile {
  type: "founder" | "mentor";
  name: string;
  email: string;
  company?: string;
  id?: string;
  [key: string]: unknown;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    const userJson = localStorage.getItem("lemons_user");
    if (!userJson) {
      router.push("/auth/login");
      return;
    }
    setUser(JSON.parse(userJson));
    setFeedbackList(JSON.parse(localStorage.getItem("lemons_feedback") || "[]"));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("lemons_user");
    router.push("/");
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isFounder = user.type === "founder";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/15 text-primary text-lg font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground">
              {isFounder ? (
                <>Founder{user.company ? ` at ${user.company}` : ""}</>
              ) : (
                <>Mentor</>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mentors.length}</p>
              <p className="text-xs text-muted-foreground">Mentors in Network</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Trophy className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{founders.length}</p>
              <p className="text-xs text-muted-foreground">Founders in Community</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mentors.reduce((acc, m) => acc + m.sessions_completed, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Star className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {(mentors.reduce((acc, m) => acc + m.avg_rating, 0) / mentors.length).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Mentor Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isFounder && (
          <Link href="/match/results">
            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex items-center justify-between py-5">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View My Matches</p>
                    <p className="text-xs text-muted-foreground">See your ranked mentor recommendations</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        )}
        <Link href="/mentors">
          <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="flex items-center justify-between py-5">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Browse Mentors</p>
                  <p className="text-xs text-muted-foreground">Explore the full mentor network</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/founders">
          <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="flex items-center justify-between py-5">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Founder Community</p>
                  <p className="text-xs text-muted-foreground">Connect with other founders</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Feedback History */}
      {feedbackList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedbackList.map((fb, i) => {
              const mentor = mentors.find((m) => m.id === fb.mentor_id);
              return (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {mentor ? getInitials(mentor.name) : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{mentor?.name || "Unknown Mentor"}</p>
                      {fb.comment && (
                        <p className="text-xs text-muted-foreground">{fb.comment}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: fb.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent Mentors Spotlight */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recently Active Mentors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.slice(0, 6).map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{mentor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {mentor.current_role} at {mentor.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
