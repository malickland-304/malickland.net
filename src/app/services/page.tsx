import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileText, Handshake } from "lucide-react";
import { serviceOffers } from "./offers";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Clear MalickLand and MEDjAi service offers for WV buyers, sellers, owners, and investors.",
};

const icons = [Handshake, FileText, ClipboardCheck];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#1C3A1C] text-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Clear WV Property Offers
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Pick the simplest path: move a real estate deal forward through
              MalickLand, or request a focused MEDjAi report before making a
              property decision.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#C4A040] text-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="font-semibold">
            Need fast cash flow first? Start with deal facilitation.
          </p>
          <Link
            href="/contact?service=deal-facilitation"
            className="inline-flex items-center justify-center gap-2 rounded bg-white px-4 py-2 text-sm font-bold text-[#1C3A1C] hover:bg-slate-100 transition-colors"
          >
            Start Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceOffers.map((offer, index) => {
            const Icon = icons[index] ?? FileText;
            return (
              <article
                key={offer.slug}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1C3A1C]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#1C3A1C]" />
                </div>
                <h2 className="text-xl font-bold text-[#1C3A1C] mb-3">
                  {offer.shortTitle}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {offer.summary}
                </p>
                <div className="border-t border-slate-100 pt-4 mt-auto">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Outcome
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed mb-5">
                    {offer.outcome}
                  </p>
                  <Link
                    href={`/services/${offer.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1C3A1C] hover:text-[#C4A040] transition-colors"
                  >
                    View offer <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1C3A1C] mb-4">
            Keep the first sale simple.
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            These offers are designed to start conversations, collect qualified
            leads, and convert real property needs before heavier automation is
            built.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#1C3A1C] hover:bg-[#142814] text-white px-7 py-3 rounded-lg font-bold transition-colors"
          >
            Submit a Lead <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
