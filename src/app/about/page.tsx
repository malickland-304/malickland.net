import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Award,
  Home,
  Trees,
  Landmark,
  TrendingUp,
  Mountain,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Phil Malick",
  description:
    "Learn about Phil Malick — licensed West Virginia real estate agent serving the Eastern Panhandle. Local expertise in Hampshire, Hardy, Morgan, Berkeley, Jefferson, and Mineral counties.",
};

const expertise = [
  {
    icon: Home,
    title: "Residential Sales",
    desc: "Homes of all sizes — from starter to high-end. Deep experience navigating WV residential transactions.",
  },
  {
    icon: Trees,
    title: "Land & Rural Property",
    desc: "Farms, timber tracts, hunting land, and creek-front parcels. Mineral rights, surveys, access easements.",
  },
  {
    icon: Landmark,
    title: "Commercial Real Estate",
    desc: "Investment properties, commercial buildings, and business locations throughout the Eastern Panhandle.",
  },
  {
    icon: TrendingUp,
    title: "Investment Strategy",
    desc: "BRRRR, buy-and-hold, rental property analysis — helping investors build wealth through WV real estate.",
  },
  {
    icon: Mountain,
    title: "Vacation & Cabins",
    desc: "Mountain retreats and weekend getaways near Cacapon, the Potomac, and the WV Highlands.",
  },
  {
    icon: Award,
    title: "Negotiation",
    desc: "Straightforward, client-first negotiation. No pressure tactics — just honest advocacy.",
  },
];

const counties = [
  { name: "Hampshire County", city: "Romney (county seat)" },
  { name: "Hardy County", city: "Moorefield (county seat)" },
  { name: "Morgan County", city: "Berkeley Springs (county seat)" },
  { name: "Berkeley County", city: "Martinsburg (county seat)" },
  { name: "Jefferson County", city: "Charles Town (county seat)" },
  { name: "Mineral County", city: "Keyser (county seat)" },
];

const values = [
  {
    title: "Honest Communication",
    desc: "You'll always know where things stand. No games, no spin — just clear, timely updates.",
  },
  {
    title: "Local Knowledge",
    desc: "Every road, every hollow, every flood zone and right-of-way issue. This is home territory.",
  },
  {
    title: "Full-Service Representation",
    desc: "From first showing to closing table — Phil handles the details so you don't have to.",
  },
  {
    title: "Your Goals First",
    desc: "Whether you're buying a first home or expanding a portfolio, the strategy is built around you.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div
        className="py-20 px-4"
        style={{
          background: "linear-gradient(135deg, #0F2A0F 0%, #1C3A1C 60%, #254E25 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-[#C4A040]/20 border border-[#C4A040]/40 text-[#D4B050] text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              About Your Agent
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Phil Malick
            </h1>
            <p className="text-[#D4B050] font-semibold text-lg mb-6">
              WV Licensed Real Estate Agent · MalickLand
            </p>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Based in Romney, West Virginia — Phil Malick has spent over a
              decade helping families, investors, and landowners navigate the
              West Virginia real estate market. MalickLand is built on local
              knowledge, honest dealings, and a genuine love for this region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-7 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                Schedule a Call <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:15402461421"
                className="border-2 border-white/30 hover:border-white text-white px-7 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                (540) 246-1421
              </a>
            </div>
          </div>

          {/* Phil headshot */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-[#C4A040] shadow-2xl bg-[#1C3A1C] flex items-center justify-center">
              {/* Replace this SVG with: <Image src="/phil-headshot.jpg" alt="Phil Malick" width={224} height={224} className="object-cover w-full h-full" priority /> once you add the photo to public/ */}
              <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#1C3A1C"/>
                <path d="M50,16 L50,4 C28,4 2,20 2,50 C2,80 28,96 50,96 L50,84 C32,80 14,67 14,50 C14,33 32,20 50,16 Z" fill="#254E25"/>
                <path d="M50,16 L50,4 C72,4 98,20 98,50 C98,80 72,96 50,96 L50,84 C68,80 86,67 86,50 C86,33 68,20 50,16 Z" fill="#254E25"/>
                <circle cx="50" cy="50" r="34" fill="#C4A040" opacity="0.25"/>
                <path d="M17,68 L28,32 L36,46 L43,24 L50,14 L57,24 L64,46 L72,32 L83,68 Z" fill="#C4A040" opacity="0.6"/>
                <path d="M38,68 C32,72 31,80 36,85 C40,89 60,89 64,85 C69,80 68,72 62,68 C57,64 43,64 38,68 Z" fill="#C4A040" opacity="0.6"/>
                <text x="50" y="95" textAnchor="middle" fill="#C4A040" fontSize="7" fontFamily="sans-serif" opacity="0.8">Add photo to public/</text>
              </svg>
            </div>

          {/* Contact card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-full">
            <h3 className="text-[#D4B050] font-bold text-lg mb-6">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a
                href="tel:15402461421"
                className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors"
              >
                <div className="bg-[#C4A040]/20 p-2.5 rounded-lg">
                  <Phone className="w-5 h-5 text-[#C4A040]" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Phone / Text
                  </div>
                  <div className="font-semibold">(540) 246-1421</div>
                </div>
              </a>
              <a
                href="mailto:phil@malickland.net"
                className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors"
              >
                <div className="bg-[#C4A040]/20 p-2.5 rounded-lg">
                  <Mail className="w-5 h-5 text-[#C4A040]" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Email
                  </div>
                  <div className="font-semibold">phil@malickland.net</div>
                </div>
              </a>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="bg-[#C4A040]/20 p-2.5 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#C4A040]" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Office
                  </div>
                  <div className="font-semibold">
                    501 East Main Street
                    <br />
                    Romney, WV 26757
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-bold text-[#1C3A1C] mb-6">
                Background & Experience
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Phil Malick grew up in West Virginia and has spent his entire
                  real estate career focused on the Eastern Panhandle — the
                  counties that stretch from the Potomac River down through the
                  WV Highlands. That&apos;s not a corporate territory
                  assignment; it&apos;s home.
                </p>
                <p>
                  Over the past decade-plus, Phil has closed transactions
                  spanning historic in-town homes, river-front farms, timber
                  tracts, vacation cabins, and commercial buildings. He&apos;s
                  helped first-time buyers land their dream home, helped estates
                  settle rural land holdings, and guided out-of-state investors
                  building WV rental portfolios.
                </p>
                <p>
                  As a licensed West Virginia real estate agent, Phil brings
                  hands-on knowledge of the practical issues that matter most in
                  this region: mineral rights, right-of-way access, well and
                  septic systems, flood zones, survey discrepancies, and title
                  challenges common in WV rural property. He knows which
                  questions to ask and which professionals to call.
                </p>
                <p>
                  MalickLand is Phil&apos;s independent agency — built to serve
                  clients directly, without corporate bureaucracy. When you work
                  with MalickLand, you work with Phil.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Values */}
              <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200">
                <h3 className="font-bold text-[#1C3A1C] text-lg mb-5">
                  How Phil Works
                </h3>
                <div className="space-y-4">
                  {values.map((v) => (
                    <div key={v.title} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C4A040] mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-[#1C3A1C] text-sm">
                          {v.title}
                        </div>
                        <div className="text-slate-500 text-sm">{v.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="bg-[#1C3A1C] rounded-2xl p-7 text-white">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-[#D4B050] fill-[#D4B050]"
                    />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed italic mb-4">
                  &ldquo;Phil is the best realtor in Hampshire County. He knew
                  every detail about every property we looked at. If you
                  need a WV agent who actually knows the market, call
                  Phil.&rdquo;
                </p>
                <div className="text-slate-400 text-xs">
                  — Verified Client, Romney WV
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C3A1C] mb-3">
              Areas of Expertise
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Every transaction type Phil handles — from single-family homes to
              raw land to commercial investment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {expertise.map((e) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.title}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#C4A040]/40 hover:shadow-md transition-all"
                >
                  <div className="bg-[#1C3A1C]/10 w-11 h-11 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#1C3A1C]" />
                  </div>
                  <h3 className="font-bold text-[#1C3A1C] mb-2">{e.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {e.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C3A1C] mb-3">
              Service Area
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Phil serves all six counties of the Eastern Panhandle — and
              surrounding areas when needed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {counties.map((c) => (
              <div
                key={c.name}
                className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5"
              >
                <MapPin className="w-5 h-5 text-[#C4A040] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1C3A1C] text-sm">
                    {c.name}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">{c.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1C3A1C]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Work With Phil?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Whether you&apos;re buying, selling, or just exploring the WV
            market — reach out. No pressure, just honest answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              Contact Phil Today
            </Link>
            <a
              href="tel:15402461421"
              className="border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              (540) 246-1421
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
