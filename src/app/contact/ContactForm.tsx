"use client";

import { useState } from "react";

const counties = [
  "Berkeley County",
  "Morgan County",
  "Jefferson County",
  "Hampshire County",
  "Hardy County",
  "Mineral County",
];

const propertyTypes = [
  "Residential – Single Family",
  "Residential – Multi-Family",
  "Land / Acreage",
  "Commercial",
  "Farm / Ranch",
  "Investment Property",
  "Vacation / Cabin",
  "Other",
];

const inquiryTypes = [
  "Buying a Property",
  "Selling a Property",
  "Property Valuation / CMA",
  "General Question",
  "Schedule a Showing",
];

// ── Replace YOUR_FORM_ID below after signing up at formspree.io ──
// 1. Go to https://formspree.io, create a free account
// 2. Click "New Form", name it "MalickLand Contact"
// 3. Copy the form ID (looks like "xpwzqdkr") and replace YOUR_FORM_ID below
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json?.errors?.[0]?.message ||
            "Something went wrong. Please try calling or emailing directly."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error — please try again or call Phil directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-md p-10 text-center">
        <div className="w-16 h-16 bg-[#1C3A1C]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-[#1C3A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#1C3A1C] mb-3">Message Sent!</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Thanks for reaching out. Phil will personally get back to you within one business day — usually same day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:15402461421"
            className="bg-[#C4A040] hover:bg-[#D4B050] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Call Phil Now
          </a>
          <button
            onClick={() => setStatus("idle")}
            className="border border-gray-300 text-gray-600 hover:border-[#1C3A1C] px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-[#1C3A1C] mb-2">Send a Message</h2>
      <p className="text-gray-500 text-sm mb-8">
        Fill out the form and Phil will get back to you within one business day.
      </p>

      {status === "error" && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="firstName" name="firstName" required placeholder="Jane"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="lastName" name="lastName" required placeholder="Smith"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent"
            />
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email" id="email" name="email" required placeholder="jane@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel" id="phone" name="phone" placeholder="(304) 555-0100"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent"
            />
          </div>
        </div>

        {/* Inquiry type */}
        <div>
          <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 mb-1">
            How Can Phil Help? <span className="text-red-500">*</span>
          </label>
          <select
            id="inquiryType" name="inquiryType" required defaultValue=""
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent bg-white"
          >
            <option value="" disabled>Select an inquiry type…</option>
            {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Property type + County */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-semibold text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="propertyType" name="propertyType" defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent bg-white"
            >
              <option value="" disabled>Select type…</option>
              {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="county" className="block text-sm font-semibold text-gray-700 mb-1">
              County of Interest
            </label>
            <select
              id="county" name="county" defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent bg-white"
            >
              <option value="" disabled>Select county…</option>
              {counties.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-1">
            Budget / Price Range
          </label>
          <input
            type="text" id="budget" name="budget" placeholder="e.g. $200,000 – $350,000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message" name="message" required rows={5}
            placeholder="Tell Phil what you're looking for, any specific features, timeline, or questions you have…"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A040] focus:border-transparent resize-none"
          />
        </div>

        {/* Preferred contact */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Preferred Contact Method</p>
          <div className="flex flex-wrap gap-4 text-sm">
            {["Email", "Phone Call", "Text Message"].map((method) => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio" name="preferredContact"
                  value={method.toLowerCase().replace(" ", "_")}
                  className="accent-[#C4A040]"
                />
                <span className="text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-[#C4A040] hover:bg-[#D4B050] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm tracking-wide flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </>
          ) : (
            "Send Message to Phil"
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Your information is kept private and never sold. Phil typically responds within 24 hours.
        </p>
      </form>
    </div>
  );
}
