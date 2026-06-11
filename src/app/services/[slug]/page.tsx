import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  Phone,
} from "lucide-react";
import { getServiceOffer, serviceOffers } from "../offers";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceOffers.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getServiceOffer(slug);

  if (!offer) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: offer.shortTitle,
    description: offer.summary,
  };
}

export default async function ServiceOfferPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const offer = getServiceOffer(slug);

  if (!offer) notFound();

  return (
    <div className="bg-white">
      <section className="bg-[#1C3A1C] text-white px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-semibold text-[#D4B050] hover:text-white transition-colors mb-5"
            >
              Services
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              {offer.title}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
              {offer.summary}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/contact?service=${offer.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-[#C4A040] hover:bg-[#D4B050] text-white px-7 py-3 rounded-lg font-bold transition-colors"
              >
                {offer.primaryCta} <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:15402461421"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/35 hover:border-white text-white px-7 py-3 rounded-lg font-bold transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Phil
              </a>
            </div>
          </div>

          <aside className="bg-white/10 border border-white/20 rounded-xl p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#D4B050] mb-3">
              Best For
            </p>
            <p className="text-sm text-white/85 leading-relaxed mb-6">
              {offer.audience}
            </p>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#D4B050] mb-3">
              Expected Outcome
            </p>
            <p className="text-sm text-white/85 leading-relaxed">
              {offer.outcome}
            </p>
          </aside>
        </div>
      </section>

      <section className="px-4 py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="w-6 h-6 text-[#C4A040]" />
                <h2 className="text-2xl font-bold text-[#1C3A1C]">
                  What You Get
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offer.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1C3A1C] shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1C3A1C] mb-6">
                How It Works
              </h2>
              <ol className="space-y-4">
                {offer.process.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#C4A040] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed pt-1">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#1C3A1C] text-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Why This Offer Exists</h2>
              <ul className="space-y-3">
                {offer.proofPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4B050] mt-2 shrink-0" />
                    <span className="text-white/85 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {offer.disclaimer && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <FileWarning className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {offer.disclaimer}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1C3A1C] mb-3">
                Ready to start?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Send the property details you have. A short message is enough to
                open the right lane.
              </p>
              <Link
                href={`/contact?service=${offer.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C4A040] hover:bg-[#D4B050] text-white px-5 py-3 rounded-lg font-bold text-sm transition-colors"
              >
                {offer.primaryCta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
