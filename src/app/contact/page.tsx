import type { Metadata } from 'next'
import Image from 'next/image'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact | MalickLand — WV Real Estate Agency',
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

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#1C3A1C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Phil Malick</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Ready to buy, sell, or just explore your options? Reach out — no pressure, just honest
            guidance from an Eastern Panhandle WV Real Estate Agency expert.
          </p>
        </div>
      </section>

      {/* ── Quick Contact Bar ── */}
      <section className="bg-[#C4A040] text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-semibold">
          <a href="tel:15402461421" className="flex items-center gap-2 hover:text-[#1C3A1C] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            (540) 246-1421
          </a>
          <span className="hidden sm:block text-white/50">|</span>
          <a href="mailto:phil@malickland.net" className="flex items-center gap-2 hover:text-[#1C3A1C] transition-colors">
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

          {/* ── Contact Form (client component with Formspree) ── */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Phil card */}
            <div className="bg-[#1C3A1C] text-white rounded-2xl p-6 shadow-md">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C4A040] mx-auto mb-4">
                <Image
                  src="/phil-headshot.jpg"
                  alt="Phil Malick"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-center mb-1">Phil Malick</h3>
              <p className="text-white/70 text-sm text-center mb-4">
                WV Licensed Real Estate Agent<br />
                MalickLand — WV Real Estate Agency
              </p>
              <div className="space-y-3 text-sm">
                <a href="tel:15402461421" className="flex items-center gap-3 hover:text-[#D4B050] transition-colors">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                  </span>
                  (540) 246-1421
                </a>
                <a href="mailto:phil@malickland.net" className="flex items-center gap-3 hover:text-[#D4B050] transition-colors">
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
              <h3 className="font-bold text-[#1C3A1C] text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#C4A040]" fill="currentColor" viewBox="0 0 24 24">
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
              <h3 className="font-bold text-[#1C3A1C] text-lg mb-4">Areas Served</h3>
              <div className="grid grid-cols-2 gap-2">
                {counties.map((county) => (
                  <div key={county} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4A040] flex-shrink-0" />
                    {county}
                  </div>
                ))}
              </div>
            </div>

            {/* Response promise */}
            <div className="bg-[#D4B050]/10 border border-[#C4A040]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-bold text-[#1C3A1C] text-sm mb-1">Quick Response Guarantee</p>
                  <p className="text-xs text-gray-600">Phil personally responds to every inquiry within one business day — often same day.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Google Maps Embed — 501 E Main St, Romney, WV ── */}
      <section className="h-80 w-full">
        <iframe
          title="MalickLand Office — 501 E Main St, Romney WV"
          src="https://maps.google.com/maps?q=501+E+Main+St,+Romney,+WV+26757&z=15&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
