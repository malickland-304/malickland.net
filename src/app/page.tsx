import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Home,
  TrendingUp,
  Shield,
  Star,
  ChevronRight,
  Mountain,
  Trees,
  Landmark,
  ArrowRight,
} from "lucide-react";

// ─── Stats ───────────────────────────────────────────────────────────────────
const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "6", label: "WV Counties Served" },
  { value: "100+", label: "Happy Clients" },
  { value: "5★", label: "Client Rating" },
];

// ─── Services ────────────────────────────────────────────────────────────────
const services = [
  {
    icon: Home,
    title: "Residential Sales",
    desc: "Expert guidance buying or selling your home in the Eastern Panhandle — from starter homes to luxury estates.",
  },
  {
    icon: Trees,
    title: "Land & Acreage",
    desc: "WV land, farms, timber tracts, and rural properties. Knowledgeable on mineral rights, surveys, and access.",
  },
  {
    icon: Landmark,
    title: "Commercial Real Estate",
    desc: "Commercial properties, investment real estate, and business locations throughout Hampshire County and beyond.",
  },
  {
    icon: TrendingUp,
    title: "Investment Properties",
    desc: "Rental homes, multi-family, and BRRRR strategy properties. Local market insight to maximize your return.",
  },
  {
    icon: Shield,
    title: "Buyer Representation",
    desc: "Full buyer advocacy — from search to closing. Negotiation, inspection coordination, and title oversight.",
  },
  {
    icon: Mountain,
    title: "Vacation & Second Homes",
    desc: "Cabins, mountain retreats, and vacation properties across the WV Eastern Panhandle and Potomac Highlands.",
  },
];

// ─── Counties ────────────────────────────────────────────────────────────────
const counties = [
  "Hampshire County",
  "Hardy County",
  "Morgan County",
  "Berkeley County",
  "Jefferson County",
  "Mineral County",
];

// ─── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Sarah & Tom W.",
    location: "Romney, WV",
    quote:
      "Phil found us the perfect property just outside of Romney. He knew every detail about the area and made the whole process simple. Highly recommend!",
  },
  {
    name: "James K.",
    location: "Berkeley Springs, WV",
    quote:
      "Sold our family farm with Phil's help. He handled everything professionally and got us a great price. Couldn't have asked for a better agent.",
  },
  {
    name: "Linda M.",
    location: "Moorefield, WV",
    quote:
      "As an out-of-state buyer, I needed someone who really knew the market. Phil was patient, knowledgeable, and got our offer accepted on the first try.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F2A0F 0%, #1C3A1C 50%, #254E25 100%)",
        }}
      >
        {/* Decorative mountain silhouette */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' d='M0,160L60,138.7C120,117,240,75,360,80C480,85,600,139,720,149.3C840,160,960,128,1080,112C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C4A040]/20 border border-[#C4A040]/40 rounded-full px-4 py-1.5 text-[#D4B050] text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Eastern Panhandle, West Virginia
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your WV Real Estate
              <span className="text-[#C4A040]"> Expert</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              Phil Malick and MalickLand help buyers, sellers, and investors
              navigate the West Virginia real estate market — from Romney to
              Martinsburg, and every hollow in between.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/listings"
                className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-8 py-3.5 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                View Listings <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white/30 hover:border-white text-white px-8 py-3.5 rounded-lg font-semibold text-center transition-colors"
              >
                Contact Phil
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
              <a
                href="tel:15402461421"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C4A040]" />
                <span className="text-sm">(540) 246-1421</span>
              </a>
              <a
                href="mailto:phil@malickland.net"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C4A040]" />
                <span className="text-sm">phil@malickland.net</span>
              </a>
            </div>
          </div>

          {/* Stats card */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="text-center bg-white/5 rounded-xl p-5"
                  >
                    <div className="text-3xl font-bold text-[#D4B050]">
                      {s.value}
                    </div>
                    <div className="text-slate-300 text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-[#C4A040]/20 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#D4B050] fill-[#D4B050]"
                    />
                  ))}
                </div>
                <p className="text-white text-sm font-medium">
                  "Phil is the best realtor in Hampshire County."
                </p>
                <p className="text-slate-400 text-xs mt-1">— Verified Client</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AREAS SERVED ─────────────────────────────────────────────── */}
      <section className="bg-[#1C3A1C] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="text-[#C4A040] text-sm font-semibold uppercase tracking-wider">
              Serving:
            </span>
            {counties.map((c, i) => (
              <span
                key={c}
                className="text-slate-300 text-sm flex items-center gap-1.5"
              >
                {c}
                {i < counties.length - 1 && (
                  <span className="text-slate-600 hidden sm:inline">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C3A1C] mb-4">
              How MalickLand Can Help
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From first-time buyers to seasoned investors — comprehensive WV
              real estate services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#C4A040]/50 hover:shadow-md transition-all group"
                >
                  <div className="bg-[#1C3A1C]/10 group-hover:bg-[#1C3A1C] w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6 text-[#1C3A1C] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1C3A1C] mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#C4A040]/10 text-[#C4A040] font-semibold text-sm px-3 py-1 rounded mb-4 uppercase tracking-wider">
                About Your Agent
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C3A1C] mb-6">
                Phil Malick
                <br />
                <span className="text-slate-500 text-2xl font-normal">
                  WV Real Estate Agent
                </span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Based in Romney, West Virginia, Phil Malick has been helping
                families and investors buy, sell, and invest in WV real estate
                for over a decade. As a licensed West Virginia real estate
                agent, Phil brings deep local knowledge of the Eastern
                Panhandle market.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Whether you're searching for a historic home in downtown Romney,
                farmland in Hardy County, or a vacation cabin near Cacapon State
                Park — Phil knows this market and will work tirelessly on your
                behalf.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="bg-[#1C3A1C] hover:bg-[#142814] text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-[#1C3A1C] text-[#1C3A1C] hover:bg-[#1C3A1C] hover:text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Schedule a Call
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1C3A1C] to-[#254E25] rounded-2xl p-8 text-white">
              <h3 className="font-bold text-xl mb-6 text-[#D4B050]">
                Why Choose MalickLand?
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "Local Expertise",
                    desc: "Born and raised in WV — knows every county, road, and community.",
                  },
                  {
                    title: "Full-Service Representation",
                    desc: "Buyers, sellers, investors — covered from contract to closing.",
                  },
                  {
                    title: "Honest Communication",
                    desc: "Transparent, timely updates. No games, no pressure.",
                  },
                  {
                    title: "WV-Specific Knowledge",
                    desc: "Mineral rights, right-of-way, septic, well — rural property expertise.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C4A040] mt-2 shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-slate-300 text-sm">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1C3A1C] text-center mb-12">
            What Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#D4B050] fill-[#D4B050]"
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-[#1C3A1C] text-sm">
                    {t.name}
                  </div>
                  <div className="text-slate-400 text-xs">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1C3A1C]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Buy or Sell in WV?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Let's talk about your real estate goals. Phil is available to answer
            questions, provide a free home valuation, or help you start your
            property search.
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
