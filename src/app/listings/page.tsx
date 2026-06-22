import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, ArrowRight, Home, Trees, Landmark } from "lucide-react";
import { LICENSED_OFFICE } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "MalickLand's West Virginia property listings are coming online soon. Contact Phil Malick, WV Licensed Real Estate Agent, for current inventory and off-market opportunities across the Eastern Panhandle.",
  // Placeholder page until the live listing system is published — keep it out of
  // the search index and unlinked from primary navigation (see DECISIONS.md).
  robots: { index: false, follow: true },
};

const o = LICENSED_OFFICE;

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#1C3A1C] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            WV Property Listings
          </h1>
          <p className="text-slate-300 text-lg max-w-xl">
            Homes, land, and commercial real estate across West Virginia&apos;s
            Eastern Panhandle.
          </p>
        </div>
      </div>

      {/* Coming-soon / contact-first body (no inventory shown until the live
          listing system is published) */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 text-center">
          <div className="flex justify-center gap-4 mb-6 text-[#C4A040]">
            <Home className="w-9 h-9" />
            <Trees className="w-9 h-9" />
            <Landmark className="w-9 h-9" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C3A1C] mb-4">
            Our Online Listings Are Coming Soon
          </h2>
          <p className="text-slate-600 leading-relaxed mb-3 max-w-xl mx-auto">
            We&apos;re finishing our searchable listings experience. In the
            meantime, {o.agentName} can share current inventory, new listings,
            and off-market properties directly — matched to your location, price
            range, acreage, and property type.
          </p>
          <p className="text-slate-500 text-sm mb-8 max-w-xl mx-auto">
            Serving Hampshire, Hardy, Morgan, Berkeley, Jefferson, and Mineral
            counties.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-8 py-3.5 rounded-lg font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              Tell Phil What You&apos;re Looking For{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={o.phoneHref}
              className="border-2 border-[#1C3A1C] text-[#1C3A1C] hover:bg-[#1C3A1C] hover:text-white px-8 py-3.5 rounded-lg font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {o.phoneDisplay}
            </a>
          </div>
          <div className="mt-6">
            <a
              href={`mailto:${o.email}`}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1C3A1C] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#C4A040]" />
              {o.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
