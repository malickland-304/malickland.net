import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Search,
  Home,
  Trees,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse available properties for sale in West Virginia's Eastern Panhandle — homes, land, commercial real estate.",
};

// Placeholder listings — will be replaced with live data from wv-realestate API
const sampleListings = [
  {
    id: 1,
    address: "123 Cacapon Road",
    city: "Berkeley Springs",
    county: "Morgan County",
    price: 285000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    type: "Residential",
    status: "Active",
    description:
      "Charming 3BR/2BA on the edge of Cacapon State Park. Updated kitchen, hardwood floors throughout, detached garage.",
  },
  {
    id: 2,
    address: "45 Acres — Route 28",
    city: "Moorefield",
    county: "Hardy County",
    price: 189000,
    beds: null,
    baths: null,
    sqft: null,
    acres: 45,
    type: "Land",
    status: "Active",
    description:
      "Unrestricted 45-acre tract with creek frontage, mature timber, and mountain views. Road frontage on Rt. 28.",
  },
  {
    id: 3,
    address: "801 S. High Street",
    city: "Romney",
    county: "Hampshire County",
    price: 175000,
    beds: 4,
    baths: 2,
    sqft: 2100,
    type: "Residential",
    status: "Active",
    description:
      "Historic in-town home with original woodwork and character throughout. Large lot, covered porch, detached garage.",
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  Residential: <Home className="w-4 h-4" />,
  Land: <Trees className="w-4 h-4" />,
  Commercial: <Landmark className="w-4 h-4" />,
};

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#1e3a5f] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            WV Property Listings
          </h1>
          <p className="text-slate-300 text-lg">
            Homes, land, and commercial real estate across the Eastern Panhandle
          </p>
        </div>
      </div>

      {/* Search bar (static — would connect to live API) */}
      <div className="bg-white border-b border-slate-200 py-5 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by city, county, or address..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
              />
            </div>
            <select className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="land">Land & Acreage</option>
              <option value="commercial">Commercial</option>
            </select>
            <select className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <option value="">All Counties</option>
              <option value="hampshire">Hampshire</option>
              <option value="hardy">Hardy</option>
              <option value="morgan">Morgan</option>
              <option value="berkeley">Berkeley</option>
              <option value="jefferson">Jefferson</option>
              <option value="mineral">Mineral</option>
            </select>
            <button className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Listings grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-slate-500 text-sm mb-6">
          Showing {sampleListings.length} active listings — updated regularly.
          Contact Phil for the latest inventory.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Photo placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2a4f7a] flex items-center justify-center relative">
                <div className="text-white/20">
                  {typeIcons[listing.type] || <Home className="w-16 h-16" />}
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {listing.status}
                  </span>
                  <span className="bg-[#1e3a5f]/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {listing.type}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#c8961e] text-white font-bold px-3 py-1.5 rounded-lg text-sm">
                  ${listing.price.toLocaleString()}
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="font-bold text-[#1e3a5f] text-base leading-tight mb-1">
                  {listing.address}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.city}, WV — {listing.county}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  {listing.beds !== null && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-slate-400" />
                      {listing.beds} BD
                    </div>
                  )}
                  {listing.baths !== null && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-slate-400" />
                      {listing.baths} BA
                    </div>
                  )}
                  {listing.sqft && (
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4 text-slate-400" />
                      {listing.sqft.toLocaleString()} sf
                    </div>
                  )}
                  {"acres" in listing && listing.acres && (
                    <div className="flex items-center gap-1">
                      <Trees className="w-4 h-4 text-slate-400" />
                      {listing.acres} ac
                    </div>
                  )}
                </div>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {listing.description}
                </p>

                <Link
                  href="/contact"
                  className="w-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white py-2.5 rounded-lg text-sm font-semibold text-center transition-colors block"
                >
                  Inquire About This Property
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-[#1e3a5f] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Don&apos;t See What You&apos;re Looking For?
          </h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Phil has access to off-market properties and new listings before
            they hit public databases. Tell us what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-[#c8961e] hover:bg-[#f0b429] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Submit a Property Request
            </Link>
            <a
              href="tel:15402461421"
              className="border-2 border-white/40 hover:border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Phil Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
