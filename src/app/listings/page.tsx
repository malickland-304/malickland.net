import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Square, Phone, Home, Trees, Landmark,
  Building2, Mountain, SlidersHorizontal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse homes, land, and commercial real estate for sale in West Virginia's Eastern Panhandle — MalickLand, Phil Malick WV Real Estate Agent.",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Listing {
  slug: string;
  title: string;
  price: number | null;
  city: string;
  county: string;
  type: string;
  status: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  acres: number | null;
  cover: string | null;
  url: string;
  updatedAt: string;
}

// ─── Fetch live listings from Cloudflare Worker ───────────────────────────────
async function fetchListings(): Promise<Listing[]> {
  const apiUrl =
    process.env.LISTINGS_API_URL ?? "https://malickland.net/api/listings";
  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data = await res.json();
    return (data.listings ?? []) as Listing[];
  } catch (err) {
    console.warn("[Listings] API fetch failed, using fallback:", err);
    return FALLBACK_LISTINGS;
  }
}

// ─── Fallback sample listings (shown if API is unreachable) ──────────────────
const FALLBACK_LISTINGS: Listing[] = [
  {
    slug: "123-cacapon-road-berkeley-springs",
    title: "123 Cacapon Road",
    price: 285000,
    city: "Berkeley Springs",
    county: "Morgan County",
    type: "Residential",
    status: "Active",
    beds: 3, baths: 2, sqft: 1650, acres: null,
    cover: null, url: "#",
    updatedAt: new Date().toISOString(),
  },
  {
    slug: "45-acres-route-28-moorefield",
    title: "45 Acres — Route 28",
    price: 189000,
    city: "Moorefield",
    county: "Hardy County",
    type: "Land",
    status: "Active",
    beds: null, baths: null, sqft: null, acres: 45,
    cover: null, url: "#",
    updatedAt: new Date().toISOString(),
  },
  {
    slug: "801-s-high-street-romney",
    title: "801 S. High Street",
    price: 175000,
    city: "Romney",
    county: "Hampshire County",
    type: "Residential",
    status: "Active",
    beds: 4, baths: 2, sqft: 2100, acres: null,
    cover: null, url: "#",
    updatedAt: new Date().toISOString(),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
type IconComponent = React.ComponentType<{ className?: string }>;

const typeIcon: Record<string, IconComponent> = {
  Residential: Home,
  Land: Trees,
  Farm: Trees,
  Commercial: Landmark,
  "Multi-Family": Building2,
  Cabin: Mountain,
};

function formatPrice(p: number | null) {
  if (!p) return "Price TBD";
  return "$" + p.toLocaleString();
}

function statusColor(s: string) {
  if (s === "Active") return "bg-green-500";
  if (s === "Pending") return "bg-amber-500";
  return "bg-gray-400";
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ l }: { l: Listing }) {
  const Icon = typeIcon[l.type] ?? Home;
  const isLive = l.url && l.url !== "#";
  const href = isLive
    ? l.url
    : `/contact?listing=${encodeURIComponent(l.title)}`;

  const stats = [
    l.beds != null && { val: l.beds, lbl: "BD", Icon: Bed },
    l.baths != null && { val: l.baths, lbl: "BA", Icon: Bath },
    l.sqft && { val: l.sqft.toLocaleString(), lbl: "SF", Icon: Square },
    l.acres && { val: l.acres, lbl: "AC", Icon: Trees },
  ].filter(Boolean) as { val: string | number; lbl: string; Icon: IconComponent }[];

  return (
    <Link
      href={href}
      target={isLive ? "_blank" : undefined}
      rel={isLive ? "noopener noreferrer" : undefined}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gradient-to-br from-[#1C3A1C] to-[#254E25] flex items-center justify-center overflow-hidden">
        {l.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={l.cover}
            alt={l.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Icon className="w-16 h-16 text-white/15" />
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className={`${statusColor(l.status)} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full`}
          >
            {l.status}
          </span>
          <span className="bg-black/50 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            {l.type}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-[#C4A040] text-white font-bold px-3 py-1 rounded-lg text-sm shadow-lg">
          {formatPrice(l.price)}
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#1C3A1C] text-base leading-snug mb-1.5 group-hover:text-[#C4A040] transition-colors">
          {l.title}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
          <MapPin className="w-3 h-3 text-[#C4A040] shrink-0" />
          {[l.city, l.county].filter(Boolean).join(" · ")}, WV
        </div>

        {stats.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-slate-600 border-t border-slate-100 pt-3 mt-auto">
            {stats.map((s) => (
              <div key={s.lbl} className="flex items-center gap-1">
                <s.Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{s.val}</span>
                <span className="text-slate-400 text-xs">{s.lbl}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ListingsPage() {
  const listings = await fetchListings();
  const active = listings.filter((l) => l.status === "Active" || !l.status);
  const pending = listings.filter((l) => l.status === "Pending");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-[#1C3A1C] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            WV Property Listings
          </h1>
          <p className="text-slate-300 text-lg max-w-xl">
            Homes, land, and commercial real estate across West Virginia&apos;s Eastern Panhandle.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <span className="bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
              {active.length} Active
            </span>
            {pending.length > 0 && (
              <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold px-3 py-1 rounded-full">
                {pending.length} Pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar (static UI — connect to live search in future) */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-14 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by city, county, or address..."
                className="w-full pl-4 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A1C]/20 focus:border-[#1C3A1C]"
                readOnly
              />
            </div>
            <button className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <Link
              href="/contact"
              className="bg-[#1C3A1C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#142814] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              Contact Phil
            </Link>
          </div>
        </div>
      </div>

      {/* Listings grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {active.length > 0 ? (
          <>
            <p className="text-slate-500 text-sm mb-6">
              Showing{" "}
              <strong className="text-slate-700">{active.length}</strong> active
              listing{active.length !== 1 ? "s" : ""} — updated regularly.
              Contact Phil for the latest inventory.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((l) => (
                <ListingCard key={l.slug} l={l} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <Home className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Active Listings Right Now
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              New listings are added regularly. Contact Phil for current
              inventory and off-market properties.
            </p>
            <Link
              href="/contact"
              className="bg-[#1C3A1C] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#142814] transition-colors"
            >
              Contact Phil
            </Link>
          </div>
        )}

        {/* Pending section */}
        {pending.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[#1C3A1C] mb-6 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Pending
              </span>
              Recently Under Contract
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {pending.map((l) => (
                <ListingCard key={l.slug} l={l} />
              ))}
            </div>
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-14 bg-[#1C3A1C] rounded-2xl p-8 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Don&apos;t See What You&apos;re Looking For?
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Phil has access to off-market properties and new listings before they
            hit public databases. Tell us what you need — location, price range,
            acreage, property type.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-8 py-3.5 rounded-lg font-bold transition-colors"
            >
              Submit a Property Request
            </Link>
            <a
              href="tel:15402461421"
              className="border-2 border-white/40 hover:border-white text-white px-8 py-3.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Phil: (540) 246-1421
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
