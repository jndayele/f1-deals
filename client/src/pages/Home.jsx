import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import CarCard from "@/components/CarCard";
import StarRating from "@/components/StarRating";
import { carService, reviewService } from "@/lib/api";
import { getWhatsAppLink, SERVICES } from "@/lib/constants";
import SEO from "@/components/SEO";


function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([carService.getFeatured(), reviewService.getAll()]).then(
      ([cars, reviewData]) => {
        setFeaturedCars(cars);
        setReviews(reviewData?.items || []);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div>
      <SEO
        title="Buy, Sell & Swap Cars in Ghana"
        description="F1 Deals is Ghana's #1 nationwide car broker. Buy brand new and foreign used cars, sell your vehicle for the best price, swap, ship, and get top-quality maintenance across all 16 regions. Call 055 436 7094."
        canonicalPath="/"
        ogImage="/home-page.png"
      />
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/home-page.png"
            alt="Luxury vehicle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-20 lg:pb-28 pt-32 w-full">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-5 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-[#E10600]" />
              01 — Ghana's Premier Auto Broker
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-6"
            >
              Drive your<br />
              ambition<span className="text-[#E10600]">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base lg:text-lg text-white/60 leading-relaxed mb-10 max-w-lg"
            >
              Buy, sell, swap, or ship — F1 Deals is your trusted partner for
              every automotive need across Ghana. No showroom needed. We come to you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/inventory"
                className="group bg-[#E10600] text-white px-8 py-4 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-all inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                Browse Inventory
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getWhatsAppLink("Hi F1 Deals, I'm interested in your vehicles.")}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 text-white px-8 py-4 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-white/5 transition-all inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>
        </div>

        {/* Technical line decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E10600]/30" />
      </section>

      {/* STATS */}
      <section className="bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "Vehicles Sold" },
              { value: 8, suffix: "+", label: "Years Experience" },
              { value: 16, suffix: "", label: "Regions Served" },
              { value: 98, suffix: "%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center lg:text-left">
                  <p className="font-heading text-3xl lg:text-4xl font-bold text-white">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="bg-[#0A0A0A] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <ScrollReveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-[#E10600]" />
                02 — Inventory
              </p>
              <h2 className="font-heading text-3xl lg:text-5xl font-bold text-white">
                Featured vehicles
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Link
                to="/inventory"
                className="group font-mono text-xs uppercase tracking-widest text-white/50 hover:text-[#E10600] transition-colors inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                View all inventory
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border border-white/10 animate-pulse">
                  <div className="aspect-[16/10] bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-white/5 w-1/3" />
                    <div className="h-6 bg-white/5 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCars.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-[#F4F4F5] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <ScrollReveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-[#E10600]" />
              03 — What We Do
            </p>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-[#0A0A0A] mb-14">
              Full-service automotive<br />dealership
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <div className="bg-white border border-[#0A0A0A]/10 p-8 lg:p-10 h-full group hover:border-[#E10600]/30 transition-colors duration-300">
                  <span className="font-heading text-5xl font-bold text-[#E10600]/10 group-hover:text-[#E10600]/20 transition-colors">
                    {service.id}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-[#0A0A0A] mt-4 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#0A0A0A]/60 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <a
                    href={getWhatsAppLink(service.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-widest text-[#E10600] hover:text-[#B80500] inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                  >
                    Enquire
                    <ArrowRight size={12} />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                Explore All Services
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* REVIEWS HIGHLIGHT */}
      <section className="bg-[#0A0A0A] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-14">
            <ScrollReveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-[#E10600]" />
                04 — Testimonials
              </p>
              <h2 className="font-heading text-3xl lg:text-5xl font-bold text-white">
                Trusted by drivers<br />across Ghana
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Link
                to="/reviews"
                className="group font-mono text-xs uppercase tracking-widest text-white/50 hover:text-[#E10600] transition-colors inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                Read all reviews
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>

          {!loading && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, i) => (
                <ScrollReveal key={review.id} delay={i * 0.1}>
                  <div className="border border-white/10 p-8 h-full flex flex-col">
                    <StarRating rating={review.rating} size={16} />
                    <p className="text-sm text-white/60 leading-relaxed mt-5 mb-6 flex-grow">
                      "{review.message}"
                    </p>
                    <div>
                      <p className="font-heading font-semibold text-white text-sm">
                        {review.name}
                      </p>
                      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">
                        Verified Buyer
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}