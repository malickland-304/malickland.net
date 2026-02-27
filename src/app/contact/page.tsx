import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | MalickLand Real Estate',
  description: 'Get in touch with Phil Malick, your Eastern Panhandle WV real estate expert. Call, email, or fill out the form below.',
}

const counties = [
  'Berkeley County',
  'Morgan County',
  'Jefferson County',
  'Hampshire County',
  'Hardy County',
  'Mineral County',
]

const propertyTypes = [
  'Residential – Single Family',
  'Residential – Multi-Family',
  'Land / Acreage',
  'Commercial',
  'Farm / Ranch',
  'Investment Property',
  'Vacation / Cabin',
  'Other',
]

const inquiryTypes = [
  'Buying a Property',
  'Selling a Property',
  'Property Valuation / CMA',
  'General Question',
  'Schedule a Showing',
]

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Phil Malick</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Ready to buy, sell, or just explore your options? Reach out — no pressure, just honest guidance from an Eastern Panhandle WV expert.
          </p>
        </div>
      </section>

      {/* ── Quick Contact Bar ── */}
      <section className="bg-[#c8961e] text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-semibold">
          <a href="tel:15402461421" className="flex items-center gap-2 hover:text-[#1e3a5f] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            (540) 246-1421
          </a>
          <span className="hidden sm:block text-white/50">|</span>
          <a href="mailto:phil@malickland.net" className="flex items-center gap-2 hover:text-[#1e3a5f] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            phil@malickland.net
          </a>
          <span className="hidden sm:block text-white/50">|</span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            501 E Main St, Romney WV 26757
          </span>
        </div>
      </section>

      {/* ── Main Content: Form + Sidebar ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Contact Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Send a Message</h2>
              <p className="text-gray-500 text-sm mb-8">
                Fill out the form and Phil will get back to you within one business day.
              </p>

              <form className="space-y-6">
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      placeholder="Jane"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      placeholder="Smith"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent"
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
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(304) 555-0100"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Inquiry type */}
                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 mb-1">
                    How Can Phil Help? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    required
                    defaultValue=""
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent bg-white"
                  >
                    <option value="" disabled>Select an inquiry type…</option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Property type + County */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-semibold text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      defaultValue=""
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent bg-white"
                    >
                      <option value="" disabled>Select type…</option>
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="county" className="block text-sm font-semibold text-gray-700 mb-1">
                      County of Interest
                    </label>
                    <select
                      id="county"
                      name="county"
                      defaultValue=""
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent bg-white"
                    >
                      <option value="" disabled>Select county…</option>
                      {counties.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-1">
                    Budget / Price Range
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    placeholder="e.g. $200,000 – $350,000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell Phil what you're looking for, any specific features, timeline, or questions you have…"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8961e] focus:border-transparent resize-none"
                  />
                </div>

                {/* Preferred contact */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Preferred Contact Method</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {['Email', 'Phone Call', 'Text Message'].map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method.toLowerCase().replace(' ', '_')}
                          className="accent-[#c8961e]"
                        />
                        <span className="text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#c8961e] hover:bg-[#f0b429] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm tracking-wide"
                >
                  Send Message to Phil
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Your information is kept private and never sold. Phil typically responds within 24 hours.
                </p>
              </form>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Phil card */}
            <div className="bg-[#1e3a5f] text-white rounded-2xl p-6 shadow-md">
              <div className="w-20 h-20 rounded-full bg-[#c8961e] flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
                PM
              </div>
              <h3 className="text-xl font-bold text-center mb-1">Phil Malick</h3>
              <p className="text-white/70 text-sm text-center mb-4">WV Licensed Real Estate Agent<br />Eastern Panhandle Specialist</p>
              <div className="space-y-3 text-sm">
                <a href="tel:15402461421" className="flex items-center gap-3 hover:text-[#f0b429] transition-colors">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                  </span>
                  (540) 246-1421
                </a>
                <a href="mailto:phil@malickland.net" className="flex items-center gap-3 hover:text-[#f0b429] transition-colors">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </span>
                  phil@malickland.net
                </a>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </span>
                  <span className="leading-relaxed">501 E Main St<br />Romney, WV 26757</span>
                </div>
              </div>
            </div>

            {/* Office hours */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-[#1e3a5f] text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#c8961e]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                </svg>
                Office Hours
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {[
                  { day: 'Mon – Fri', hours: '8:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'By Appointment' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium text-gray-700">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">* Available by phone for urgent matters outside business hours.</p>
            </div>

            {/* Areas served */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-[#1e3a5f] text-lg mb-4">Areas Served</h3>
              <div className="grid grid-cols-2 gap-2">
                {counties.map((county) => (
                  <div key={county} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8961e] flex-shrink-0" />
                    {county}
                  </div>
                ))}
              </div>
            </div>

            {/* Response promise */}
            <div className="bg-[#f0b429]/10 border border-[#c8961e]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-bold text-[#1e3a5f] text-sm mb-1">Quick Response Guarantee</p>
                  <p className="text-xs text-gray-600">Phil personally responds to every inquiry within one business day — often same day.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Map placeholder ── */}
      <section className="bg-gray-200 h-64 flex items-center justify-center text-gray-500 text-sm font-medium">
        <div className="text-center">
          <svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          501 E Main St, Romney, WV 26757 — Google Maps embed goes here
        </div>
      </section>
    </>
  )
}
