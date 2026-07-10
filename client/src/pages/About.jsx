import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { getWhatsAppLink } from "@/lib/mockData";

const ABOUT_IMAGE = "https://media.base44.com/images/public/6a5166ae47e3a25d1b6256a7/38f77bb58_generated_781d9f14.png";
const SECONDARY_IMAGE = "https://media.base44.com/images/public/6a5166ae47e3a25d1b6256a7/d0a318ebb_generated_2ddb5a36.png";

export default function About() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16 lg:mb-24">
        <ScrollReveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#E10600]" />
            About Us
          </p>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white">
            The F1 standard<br />of automotive service
          </h1>
        </ScrollReveal>
      </div>

      {/* Story Section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-20 lg:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <ScrollReveal direction="left">
            <div className="aspect-[4/5] overflow-hidden border border-white/10 relative">
              <img
                src={ABOUT_IMAGE}
                alt="F1 Deals interior detail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/30 to-transparent" />
            </div>
          </ScrollReveal>

          <div className="lg:pt-8">
            <ScrollReveal delay={0.1}>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-6">
                Ghana's trusted nationwide<br />car broker
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-5 text-white/60 leading-relaxed">
                <p>
                  F1 Deals was founded with a single mission: to bring the precision, 
                  speed, and reliability of Formula 1 to Ghana's automotive market. We saw 
                  an industry plagued by middlemen, hidden costs, and broken promises — and 
                  decided to build something better.
                </p>
                <p>
                  We are not a traditional showroom. We are a nationwide network — connecting 
                  buyers with the right vehicles, sellers with serious offers, and everyone 
                  with transparent, fair dealing. From Accra to Tamale, Kumasi to Cape Coast, 
                  we operate across all 16 regions of Ghana.
                </p>
                <p>
                  Every vehicle in our inventory is personally inspected and verified. Every 
                  transaction is handled with full transparency. Every client gets the kind of 
                  service that turns first-time buyers into lifelong customers.
                </p>
                <p>
                  Whether you're buying your first car, upgrading to something premium, selling 
                  a vehicle you've outgrown, or need parts shipped to your doorstep — F1 Deals 
                  has you covered. No showroom visits needed. No unnecessary markup. Just 
                  straight, honest automotive service at the speed of F1.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="border-t border-white/10 mt-10 pt-10 grid grid-cols-3 gap-6">
                {[
                  { value: "500+", label: "Cars Sold" },
                  { value: "16", label: "Regions" },
                  { value: "8+", label: "Years" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-2xl lg:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F4F4F5] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <ScrollReveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-[#E10600]" />
              Our Approach
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#0A0A0A] mb-14">
              How we operate
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#0A0A0A]/10">
            {[
              {
                num: "01",
                title: "Transparency First",
                desc: "Every vehicle comes with a full history report, honest pricing, and no hidden fees. What you see is what you get.",
              },
              {
                num: "02",
                title: "Nationwide Reach",
                desc: "We serve all 16 regions of Ghana. No showroom, no fixed address — we bring the car to you, wherever you are.",
              },
              {
                num: "03",
                title: "End-to-End Service",
                desc: "From sourcing to paperwork to delivery to maintenance — we handle the entire ownership experience.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 0.1}>
                <div className="bg-[#F4F4F5] p-8 lg:p-12 h-full">
                  <span className="font-heading text-5xl font-bold text-[#E10600]/15">
                    {item.num}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-[#0A0A0A] mt-4 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#0A0A0A]/60 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to find your<br />next vehicle?
            </h2>
            <p className="text-white/50 mb-8 max-w-md leading-relaxed">
              Browse our current inventory or reach out directly on WhatsApp. 
              We respond within the hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/inventory"
                className="group bg-[#E10600] text-white px-7 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                Browse Inventory
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getWhatsAppLink("Hi F1 Deals, I'd like to learn more about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 text-white px-7 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-white/5 transition-all inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15}>
            <div className="aspect-[16/10] overflow-hidden border border-white/10">
              <img
                src={SECONDARY_IMAGE}
                alt="Premium vehicle"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}