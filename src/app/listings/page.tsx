import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Search, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Property Search",
  description:
    "Request current West Virginia property inventory and showing help from MalickLand.",
};

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[#1C3A1C] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#D4B050]">
            Current inventory by request
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            Tell Phil what you are looking for.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            MalickLand is not publishing an automated listings feed at launch.
            For current homes, land, commercial property, or showing requests,
            send the property details you want and Phil will follow up directly.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1C3A1C]/10">
            <Search className="h-6 w-6 text-[#1C3A1C]" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-[#1C3A1C]">
            Request a property search
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Share your preferred counties, budget range, acreage, property type,
            timeline, and whether you need buyer representation, a showing, or
            help evaluating a specific property.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact?service=Listings%20%2F%20Showings"
              className="inline-flex items-center justify-center rounded bg-[#C4A040] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#D4B050]"
            >
              Send Property Criteria
            </Link>
            <a
              href="tel:15402461421"
              className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 px-6 py-3 text-sm font-semibold text-[#1C3A1C] transition-colors hover:border-[#1C3A1C]"
            >
              <Phone className="h-4 w-4" />
              Call Phil
            </a>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C4A040]/15">
            <ShieldCheck className="h-6 w-6 text-[#8A6F1F]" />
          </div>
          <h2 className="mb-3 text-xl font-bold text-[#1C3A1C]">
            Why the feed is deferred
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600">
            The launch site will not display sample or placeholder properties as
            if they were active inventory. Listings will return after the
            production data source and review process are verified.
          </p>
          <a
            href="mailto:phil@malickland.net"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C3A1C] hover:text-[#C4A040]"
          >
            <Mail className="h-4 w-4" />
            phil@malickland.net
          </a>
        </aside>
      </section>
    </main>
  );
}
