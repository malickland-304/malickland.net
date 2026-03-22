import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

function MalickLandIconSmall() {
  return (
    <svg viewBox="0 0 100 100" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,16 L50,4 C28,4 2,20 2,50 C2,80 28,96 50,96 L50,84 C32,80 14,67 14,50 C14,33 32,20 50,16 Z" fill="#1C3A1C" />
      <path d="M50,16 L50,4 C72,4 98,20 98,50 C98,80 72,96 50,96 L50,84 C68,80 86,67 86,50 C86,33 68,20 50,16 Z" fill="#1C3A1C" />
      <circle cx="50" cy="50" r="34" fill="#C4A040" />
      <path d="M17,68 L28,32 L36,46 L43,24 L50,14 L57,24 L64,46 L72,32 L83,68 Z" fill="#1C3A1C" />
      <path d="M28,32 L32,42 L36,36" fill="white" />
      <path d="M44,26 L47,34 L50,28 L53,34 L56,26 L52,32 L50,18 L48,32 Z" fill="white" />
      <path d="M64,46 L68,36 L72,32" fill="white" />
      <path d="M38,68 C32,72 31,80 36,85 C40,89 60,89 64,85 C69,80 68,72 62,68 C57,64 43,64 38,68 Z" fill="#1C3A1C" />
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
