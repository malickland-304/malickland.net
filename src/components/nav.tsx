"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Mountain, Phone } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#152d4a] text-sm py-1.5">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <span className="text-[#c8961e] font-medium">
            WV Licensed Real Estate Agent
          </span>
          <a
            href="tel:15402461421"
            className="flex items-center gap-1.5 hover:text-[#f0b429] transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            (540) 246-1421
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-[#c8961e] p-1.5 rounded">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl leading-tight tracking-wide">
              MalickLand
            </div>
            <div className="text-[10px] text-slate-300 leading-none tracking-widest uppercase">
              WV Real Estate
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-200 hover:text-[#f0b429] transition-colors font-medium text-sm tracking-wide"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-[#c8961e] hover:bg-[#f0b429] text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-slate-200 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#152d4a] border-t border-[#2a4f7a]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-slate-200 hover:text-[#f0b429] py-2 text-base font-medium border-b border-[#2a4f7a] last:border-0"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
