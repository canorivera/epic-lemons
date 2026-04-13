"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Citrus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/mentors", label: "Mentors" },
  { href: "/founders", label: "Founders" },
  { href: "/match", label: "Find a Match" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Citrus className="size-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">Lemons</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                pathname === link.href
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className={buttonVariants({ size: "sm" })}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false}>
            <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <Citrus className="size-5 text-primary" />
                    <span className="text-lg font-bold tracking-tight">
                      Lemons
                    </span>
                  </Link>
                </SheetTitle>
                <SheetClose render={<Button variant="ghost" size="icon" />}>
                  <X className="size-5" />
                  <span className="sr-only">Close menu</span>
                </SheetClose>
              </div>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:text-foreground ${
                      pathname === link.href
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                  className={buttonVariants()}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
