import Link from "next/link"
import { Citrus } from "lucide-react"

const platformLinks = [
  { href: "/mentors", label: "Mentors" },
  { href: "/founders", label: "Founders" },
  { href: "/match", label: "Find a Match" },
]

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Branding */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Citrus className="size-5 text-primary" />
              <span className="text-lg font-bold tracking-tight">Lemons</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Connecting founders with the mentors they need.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <ul className="mt-3 space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EPIC-Lab. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
