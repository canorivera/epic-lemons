"use client";

import Link from "next/link";
import { Rocket, GraduationCap, Citrus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roles = [
  {
    title: "I'm a Founder",
    description:
      "Get matched with experienced mentors who can help you navigate fundraising, product-market fit, hiring, and growth.",
    icon: Rocket,
    href: "/auth/signup/founder",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "I'm a Mentor",
    description:
      "Share your expertise with promising founders. Choose who you mentor, set your own availability, and make a real impact.",
    icon: GraduationCap,
    href: "/auth/signup/mentor",
    color: "bg-accent/20 text-accent-foreground",
  },
];

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Citrus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Join the Lemons Network</h1>
          <p className="mt-2 text-muted-foreground">
            Choose your role to get started with your personalized experience.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <Link key={role.href} href={role.href}>
              <Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${role.color}`}>
                    <role.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {role.title}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
