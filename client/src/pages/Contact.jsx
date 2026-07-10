import React, { useState } from "react";
import { MessageCircle, Instagram, Send, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { getWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/mockData";
import { enquiryService } from "@/lib/api";

const SOCIALS = [
  {
    name: "WhatsApp",
    handle: "055 436 7094",
    href: getWhatsAppLink("Hi F1 Deals!"),
    icon: MessageCircle,
    color: "bg-[#25D366]",
  },
  {
    name: "Instagram",
    handle: "@f1_deals_45",
    href: "https://instagram.com/f1_deals_45",
    icon: Instagram,
    color: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]",
  },
  {
    name: "TikTok",
    handle: "@f1_deal",
    href: "https://tiktok.com/@f1_deal",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.54a6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 3.76.92V6.19a4.84 4.84 0 0 1 0 .5z" />
      </svg>
    ),
    color: "bg-[#0A0A0A] border border-white/20",
  },
  {
    name: "Snapchat",
    handle: "F1 DEALS",
    href: "https://snapchat.com/add/f1deals",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.17 2.01c2.85.06 5.13 1.28 6.47 3.56.61 1.04.88 2.17.87 3.38-.01.71-.06 1.42-.16 2.13-.03.19.03.28.2.35.39.15.77.32 1.14.5.55.27.82.72.76 1.33-.05.51-.41.85-.93.97-.31.07-.63.1-.95.13-.27.03-.54.04-.81.1-.18.04-.33.13-.4.3-.18.38-.4.74-.66 1.07-.65.84-1.45 1.52-2.41 2-.24.12-.47.26-.64.47-.28.35-.28.73-.08 1.12.14.28.34.52.55.75.52.55.93 1.17 1.08 1.93.09.46-.04.85-.39 1.14-.38.32-.83.46-1.3.52-.49.06-.98.06-1.47-.01-.37-.05-.73-.14-1.1-.2-.2-.03-.39-.02-.58.05-.44.17-.86.4-1.31.55-1.36.46-2.76.5-4.14.12-.46-.13-.9-.32-1.33-.53-.28-.14-.57-.2-.88-.14-.42.08-.83.18-1.25.25-.44.07-.87.09-1.31.04-.51-.06-1-.21-1.41-.55-.37-.31-.49-.72-.39-1.2.16-.77.58-1.39 1.11-1.94.2-.21.39-.44.53-.7.21-.4.2-.78-.09-1.14-.17-.21-.4-.34-.64-.46-.96-.48-1.77-1.16-2.41-2.01-.26-.34-.48-.71-.66-1.1-.07-.15-.2-.24-.37-.27-.29-.06-.58-.07-.87-.1-.3-.03-.6-.07-.89-.14-.56-.13-.93-.49-.97-1.03-.04-.54.19-.98.68-1.23.38-.2.78-.36 1.18-.52.16-.07.22-.15.19-.33-.1-.72-.16-1.44-.16-2.17 0-1.17.27-2.27.85-3.28 1.33-2.31 3.61-3.56 6.47-3.62z" />
      </svg>
    ),
    color: "bg-[#FFFC00] text-[#0A0A0A]",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await enquiryService.send(formData);
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", type: "general", message: "" });
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-14 lg:mb-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-[#E10600]" />
              Contact
            </p>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white mb-4">
              Get in touch
            </h1>
            <p className="text-base text-white/50 max-w-xl leading-relaxed">
              We're available across all major platforms. Reach out on WhatsApp for the 
              fastest response — we typically reply within an hour.
            </p>
          </div>
        </ScrollReveal>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 lg:mb-24">
          {SOCIALS.map((social, i) => {
            const Icon = social.icon;
            return (
              <ScrollReveal key={social.name} delay={i * 0.1}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border border-white/10 p-5 hover:border-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                >
                  <div className={`w-12 h-12 flex items-center justify-center text-white ${social.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-white text-sm">
                      {social.name}
                    </p>
                    <p className="font-mono text-[11px] text-white/40">{social.handle}</p>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
          <ScrollReveal>
            <div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
                Financing or trade-in enquiry
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Interested in financing options or trading in your current vehicle? 
                Fill out the form and we'll get back to you with a tailored offer.
              </p>
              <div className="border-t border-white/10 pt-8 space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600] mb-1">
                    WhatsApp
                  </p>
                  <p className="text-white/60">055 436 7094</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600] mb-1">
                    Coverage
                  </p>
                  <p className="text-white/60">All 16 regions of Ghana</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600] mb-1">
                    Response Time
                  </p>
                  <p className="text-white/60">Typically within 1 hour</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="border border-white/10 bg-white/[0.02] p-6 lg:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <Send size={32} className="text-[#E10600] mx-auto mb-4" />
                  <p className="font-heading font-semibold text-white text-lg mb-2">
                    Enquiry sent!
                  </p>
                  <p className="text-sm text-white/40 mb-6">
                    We'll review your enquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#E10600] text-xs font-mono uppercase tracking-wider hover:underline focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                      Enquiry Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:border-[#E10600] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="general" className="bg-[#0A0A0A]">General Enquiry</option>
                      <option value="financing" className="bg-[#0A0A0A]">Financing</option>
                      <option value="trade-in" className="bg-[#0A0A0A]">Trade-In</option>
                      <option value="shipping" className="bg-[#0A0A0A]">Shipping Quote</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#E10600] text-white px-6 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    <ArrowRight size={16} />
                    {submitting ? "Sending…" : "Send Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}