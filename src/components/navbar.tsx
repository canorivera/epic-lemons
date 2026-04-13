"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Citrus, LogOut, LayoutDashboard } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navLinks = [
  { href: "/mentors", label: "Mentors" },
  { href: "/founders", label: "Founders" },
  { href: "/match", label: "Find a Match" },
  { href: "/admin", label: "Admin" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; type: string } | null>(null)

  useEffect(() => {
    function checkUser() {
      const stored = localStorage.getItem("lemons_user")
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }
    checkUser()
    // Re-check on route changes
    window.addEventListener("storage", checkUser)
    return () => window.removeEventListener("storage", checkUser)
  }, [pathname])

  function handleLogout() {
    localStorage.removeItem("lemons_user")
    setUser(null)
    router.push("/")
  }

  const initials = user
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : ""

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

        {/* Desktop auth / user area */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 px-2.5 py-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="ml-1 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      <LayoutDashboard className="mr-1.5 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout()
                        setOpen(false)
                      }}
                    >
                      <LogOut className="mr-1.5 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
