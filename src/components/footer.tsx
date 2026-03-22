import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

function MalickLandIconSmall() {
  return (
    <svg viewBox="0 0 100 100" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" fill="#C4A040" />
      <circle cx="50" cy="50" r="47" stroke="#1C3A1C" strokeWidth="6" fill="none" />
      <path d="M15 65 L32 32 L44 50 L50 38 L62 22 L75 45 L85 65 Z" fill="#1C3A1C" />
      <path d="M50 65 Q52 72 50 80 Q48 88 50 95" stroke="#1C3A1C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M8 30 Q2 50 10 72" stroke="#1C3A1C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M92 30 Q98 50 90 72" stroke="#1C3A1C" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0F2A0F] text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MalickLandIconSmall />
              <div>
                <div className="font-bold text-white text-lg">MalickLand</div>
                <div className="text-[10px] text-green-300 tracking-widest uppercase">
                  WV Real Estate Agency
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your Eastern Panhandle real estate specialist. Serving WV with
              integrity and local expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/listings", label: "View Listings" },
                { href: "/about", label: "About Phil" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-[#D4B050] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Areas Served
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Berkeley County</li>
              <li>Jefferson County</li>
              <li>Morgan County</li>
              <li>Hampshire County</li>
              <li>Hardy County</li>
              <li>Mineral County</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:15402461421"
                  className="flex items-start gap-2 hover:text-[#D4B050] transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#C4A040]" />
                  (540) 246-1421
                </a>
              </li>
              <li>
                <a
                  href="mailto:phil@malickland.net"
                  className="flex items-start gap-2 hover:text-[#D4B050] transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#C4A040]" />
                  phil@malickland.net
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#C4A040]" />
                  <span>
                    501 East Main Street
                    <br />
                    Romney, WV 26757
                  </span>
                </div>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#D4B050] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#D4B050] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#254E25] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>
            &copy; {year} MalickLand. All rights reserved. Phil Malick — WV
            Licensed Real Estate Agent.
          </p>
          <p>
            Equal Housing Opportunity. Information deemed reliable but not
            guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
