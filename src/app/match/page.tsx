"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MatchPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("lemons_user");
    if (user) {
      const parsed = JSON.parse(user);
      setIsLoggedIn(true);
      setUserType(parsed.type);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {userType === "founder" ? "Find Your Mentor" : "Your Mentee Matches"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {userType === "founder"
                ? "Based on your profile, we've ranked the best mentor matches for you."
                : "See which founders are looking for mentors like you."}
            </p>
            <Button className="w-full gap-2" onClick={() => router.push("/match/results")}>
              View My Matches <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Find Your Perfect Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sign up and complete your profile to get AI-powered mentor recommendations
            tailored to your startup&apos;s needs.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/auth/signup">
              <Button className="w-full gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full gap-2">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
