import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar"

// Leading "/" so these always resolve to the landing page's sections,
// regardless of which public page they're clicked from.
const NAV_LINKS = [
  { name: "Features",     link: "/#features" },
  { name: "How it works", link: "/#how"      },
  { name: "Security",     link: "/#security" },
]

export function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={NAV_LINKS} />
        <div className="flex items-center gap-2 relative z-20">
          <NavbarButton as={Link} to="/login" variant="secondary">
            Sign in
          </NavbarButton>
          <NavbarButton as={Link} to="/login" variant="primary">
            Get started
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(v => !v)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          {NAV_LINKS.map(l => (
            <a
              key={l.name}
              href={l.link}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-slate-300 hover:text-white transition-colors py-1"
            >
              {l.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-3 pt-4 border-t border-slate-800">
            <NavbarButton as={Link} to="/login" variant="secondary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Sign in
            </NavbarButton>
            <NavbarButton as={Link} to="/login" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Get started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}