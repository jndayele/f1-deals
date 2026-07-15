import React from "react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { SERVICES, getWhatsAppLink } from "@/lib/mockData";

const SERVICE_IMAGES = [
 "/home-page.png",
 "car-selling.png",
 "car-swapping.png",
 "car-shipping.png",
 "maintenance.png",
 "parts.png",
];

export default function Services() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16 lg:mb-24">
        <ScrollReveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#E10600]" />
            Our Services
          </p>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white mb-4">
            Full-service automotive<br />dealership
          </h1>
          <p className="text-base text-white/50 max-w-xl leading-relaxed">
            From sourcing your dream car to maintaining it at peak performance — F1 Deals covers 
            every aspect of car ownership across Ghana.
          </p>
        </ScrollReveal>
      </div>

      {/* Service Sections */}
      {SERVICES.map((service, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={service.id}
            className={`${i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#0E0E0E]"} border-t border-white/5`}
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isEven ? "" : "lg:direction-rtl"}`}>
                {/* Image */}
                <ScrollReveal direction={isEven ? "left" : "right"} className={isEven ? "" : "lg:order-2"}>
                  <div className="aspect-[16/10] overflow-hidden border border-white/10">
                    <img
                      src={SERVICE_IMAGES[i]}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ScrollReveal>

                {/* Content */}
                <ScrollReveal delay={0.15} className={isEven ? "" : "lg:order-1"}>
                  <span className="font-heading text-7xl lg:text-8xl font-bold text-[#E10600]/10">
                    {service.id}
                  </span>
                  <h2 className="font-heading text-2xl lg:text-4xl font-bold text-white mt-2 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed mb-8 max-w-md">
                    {service.description}
                  </p>
                  <a
                    href={getWhatsAppLink(service.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 bg-[#E10600] text-white px-7 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    Enquire Now
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}