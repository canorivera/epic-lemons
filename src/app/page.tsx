import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Link2,
  UserPlus,
  Brain,
  Handshake,
  ArrowRight,
  Sparkles,
  Users,
  Rocket,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const problems = [
  {
    icon: ShieldAlert,
    title: "Information Asymmetry",
    description:
      "The classic lemons problem: founders can't reliably assess mentor quality before committing. Bad matches waste time, money, and momentum.",
    badge: "The Lemons Problem",
  },
  {
    icon: Search,
    title: "Search Frictions",
    description:
      "Mentor profiles are walls of qualitative data. Manually parsing hundreds of bios, backgrounds, and specialties is overwhelming and error-prone.",
    badge: "Signal vs. Noise",
  },
  {
    icon: Link2,
    title: "Coordination Failures",
    description:
      "Perfect mentor-founder pairs exist but never connect. Without intelligent matching, complementary skills and needs go unrecognized.",
    badge: "Missed Connections",
  },
];

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description:
      "Answer our smart questionnaire designed to capture your startup stage, industry, challenges, and what you need most from a mentor.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Matches You",
    description:
      "Our algorithm analyzes complementary skills, experience gaps, and communication styles to find mentors who truly fit your needs.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Connect & Grow",
    description:
      "Review your personalized matches, explore mentor profiles, and book sessions directly through the platform. Start building your future.",
  },
];

const stats = [
  { value: "50+", label: "Expert Mentors", icon: Users },
  { value: "100+", label: "Founders Matched", icon: Rocket },
  { value: "500+", label: "Sessions Completed", icon: Sparkles },
  { value: "4.8", label: "Average Rating", icon: Star },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Lemons
            </span>
            <Badge
              variant="secondary"
              className="ml-1 text-[10px] font-medium tracking-wider uppercase"
            >
              by EPIC-Lab
            </Badge>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" render={<Link href="/mentors" />}>
              Explore Mentors
            </Button>
            <Button size="sm" render={<Link href="/auth/login" />}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Gradient background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 right-0 -z-0 h-[600px] w-[600px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-0 h-[400px] w-[400px] rounded-full bg-accent/[0.07] blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-20 text-center lg:pt-32 lg:pb-28">
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Mentor Matching
          </Badge>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Find the perfect{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              mentor
            </span>{" "}
            for your startup journey
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Mentorship markets suffer from the{" "}
            <span className="font-semibold text-foreground">
              lemons problem
            </span>
            . Our AI eliminates information asymmetry by intelligently matching
            founders with mentors based on complementary skills, experience, and
            goals.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8 text-base"
              render={<Link href="/mentors" />}
            >
              Explore Mentors
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 text-base"
              render={<Link href="/auth/signup" />}
            >
              Get Started
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Decorative dots grid */}
          <div className="pointer-events-none absolute right-8 bottom-12 hidden opacity-20 lg:block">
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Statement ── */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-4 text-xs font-medium tracking-wider uppercase"
            >
              The Problem
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why mentorship markets fail
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Traditional mentorship matching relies on chance encounters and
              surface-level information. We solve three fundamental market
              failures.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((problem) => (
              <Card
                key={problem.title}
                className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="relative pb-3">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <problem.icon className="h-6 w-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className="mb-2 w-fit border-primary/20 text-[11px] font-medium text-primary"
                  >
                    {problem.badge}
                  </Badge>
                  <CardTitle className="text-xl">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-[15px] leading-relaxed text-muted-foreground">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-4 text-xs font-medium tracking-wider uppercase"
            >
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Three steps to your ideal mentor
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Our platform makes mentor discovery effortless. Create a profile,
              let our AI do the heavy lifting, and start growing.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="group relative">
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-14 left-[calc(50%+4rem)] hidden h-px w-[calc(100%-8rem)] bg-gradient-to-r from-primary/30 to-primary/10 md:block" />
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-primary/5">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Network Stats ── */}
      <section className="border-y border-border/50 bg-gradient-to-r from-primary/[0.04] via-accent/[0.04] to-primary/[0.04]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-accent/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-3xl" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:py-32">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Ready to find your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              mentor
            </span>
            ?
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Join a growing network of founders and mentors. Let AI handle the
            matching so you can focus on what matters most -- building your
            startup.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8 text-base"
              render={<Link href="/auth/signup" />}
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 text-base"
              render={<Link href="/mentors" />}
            >
              Browse Mentors
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Lemons
            </span>
            <span className="text-sm text-muted-foreground">by EPIC-Lab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Solving the lemons problem in mentorship markets.
          </p>
        </div>
      </footer>
    </div>
  );
}
