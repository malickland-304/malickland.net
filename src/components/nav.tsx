"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// MalickLand brand mark — mountain peaks + winding river + sweeping outer arms
function MalickLandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left outer sweeping arm — tapered crescent wrapping left side */}
      <path
        d="M50,16 L50,4 C28,4 2,20 2,50 C2,80 28,96 50,96 L50,84 C32,80 14,67 14,50 C14,33 32,20 50,16 Z"
        fill="#1C3A1C"
      />
      {/* Right outer sweeping arm — mirror */}
      <path
        d="M50,16 L50,4 C72,4 98,20 98,50 C98,80 72,96 50,96 L50,84 C68,80 86,67 86,50 C86,33 68,20 50,16 Z"
        fill="#1C3A1C"
      />
      {/* Gold inner circle */}
      <circle cx="50" cy="50" r="34" fill="#C4A040" />
      {/* Mountain mass — three angular peaks */}
      <path
        d="M17,68 L28,32 L36,46 L43,24 L50,14 L57,24 L64,46 L72,32 L83,68 Z"
        fill="#1C3A1C"
      />
      {/* White snow/ridge cuts — left peak */}
      <path d="M28,32 L32,42 L36,36" fill="white" />
      {/* White cuts — center peak (double summit) */}
      <path d="M44,26 L47,34 L50,28 L53,34 L56,26 L52,32 L50,18 L48,32 Z" fill="white" />
      {/* White cuts — right peak */}
      <path d="M64,46 L68,36 L72,32" fill="white" />
      {/* River valley — wide winding pool at base of mountains */}
      <path
        d="M38,68 C32,72 31,80 36,85 C40,89 60,89 64,85 C69,80 68,72 62,68 C57,64 43,64 38,68 Z"
        fill="#1C3A1C"
      />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1C3A1C] text-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#142814] text-sm py-1.5">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <span className="text-[#C4A040] font-medium">
            WV Licensed Real Estate Agent · WV Real Estate Agency
          </span>
          <a
            href="tel:15402461421"
            className="flex items-center gap-1.5 hover:text-[#D4B050] transition-colors"
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
          <MalickLandIcon className="w-10 h-10" />
          <div>
            <div className="font-bold text-xl leading-tight tracking-wide">
              MalickLand
            </div>
            <div className="text-[10px] text-green-200 leading-none tracking-widest uppercase">
              WV Real Estate Agency
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-green-100 hover:text-[#D4B050] transition-colors font-medium text-sm tracking-wide"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-green-100 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#142814] border-t border-[#254E25]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-green-100 hover:text-[#D4B050] py-2 text-base font-medium border-b border-[#254E25] last:border-0"
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
