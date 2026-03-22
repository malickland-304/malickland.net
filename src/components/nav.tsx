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

// MalickLand mountain+river SVG icon — matches the actual brand mark
function MalickLandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold circle background */}
      <circle cx="50" cy="50" r="38" fill="#C4A040" />
      {/* Outer dark ring */}
      <circle cx="50" cy="50" r="47" stroke="#1C3A1C" strokeWidth="6" fill="none" />
      {/* Mountain peaks */}
      <path
        d="M15 65 L32 32 L44 50 L50 38 L62 22 L75 45 L85 65 Z"
        fill="#1C3A1C"
      />
      {/* River/road path */}
      <path
        d="M50 65 Q52 72 50 80 Q48 88 50 95"
        stroke="#1C3A1C"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Outer swoosh arcs */}
      <path
        d="M8 30 Q2 50 10 72"
        stroke="#1C3A1C"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 30 Q98 50 90 72"
        stroke="#1C3A1C"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
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
