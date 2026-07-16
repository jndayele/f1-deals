import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Send, X } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { carService, enquiryService } from "@/lib/api";
import { getWhatsAppLink } from "@/lib/constants";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [formData, setFormData] = useState({ name: "", phoneNumber: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    carService.getById(id).then((data) => {
      setCar(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await enquiryService.send({
        ...formData,
        type: "General",
        carId: car.id,
        carName: car.title || `${car.year} ${car.make} ${car.model}`,
      });
      setFormSent(true);
      setFormData({ name: "", phoneNumber: "", email: "", message: "" });
    } catch (err) {
      console.error('Enquiry error:', err);
    } finally {
      setSending(false);
    }
  };

  // Normalise the data from the backend
  const images = car?.media?.filter(m => m.isPhoto).map(m => m.url) ?? [];
  const displayName = car?.title || (car ? `${car.year} ${car.make} ${car.model}` : "");
  const isSold = car?.isSold || car?.status === "Sold";
  const fuelType = car?.fuelType || car?.fuel;

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#E10600] rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="font-heading text-2xl text-white">Vehicle not found</p>
        <Link
          to="/inventory"
          className="text-[#E10600] font-mono text-sm uppercase tracking-wider hover:underline focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
        >
          Back to inventory
        </Link>
      </div>
    );
  }

  const whatsappMsg = `Hi F1 Deals, I'm interested in the ${car.year} ${displayName} (GH₵${car.price?.toLocaleString()}). Is it still available?`;

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Back */}
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/40 hover:text-[#E10600] transition-colors mb-8 focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
        >
          <ArrowLeft size={14} />
          Back to inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* LEFT — Gallery + Details */}
          <div>
                    {/* Gallery */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[16/10] overflow-hidden mb-4 cursor-pointer group"
              onClick={() => setLightbox(true)}
            >
              <img
                src={images[activeImage] || "/ready-car.png"}
                alt={displayName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {isSold && (
                <div className="absolute top-8 -left-12 bg-[#E10600] text-white py-2 px-16 -rotate-45 font-heading font-bold uppercase tracking-wider text-sm">
                  Sold
                </div>
              )}
            </motion.div>

                        {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mb-10">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-14 overflow-hidden border-2 transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none ${
                      i === activeImage ? "border-[#E10600]" : "border-white/10"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {car.videoUrl && (
              <ScrollReveal>
                <div className="mb-10">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-4 flex items-center gap-3">
                    <span className="w-8 h-px bg-[#E10600]" />
                    Video
                  </h3>
                  <div className="aspect-video border border-white/10 overflow-hidden">
                    <iframe
                      src={car.videoUrl}
                      title="Vehicle video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Description */}
            <ScrollReveal>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-[#E10600]" />
                Description
              </h3>
              <p className="text-white/60 leading-relaxed text-sm lg:text-base mb-10">
                {car.description}
              </p>
            </ScrollReveal>

            {/* Specs Table */}
            <ScrollReveal>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-[#E10600]" />
                Specifications
              </h3>
              <div className="border border-white/10">
                {[
                   ["Year", car.year],
                   ["Condition", car.condition],
                   ["Mileage", car.mileage ? `${car.mileage.toLocaleString()} km` : "—"],
                   ["Transmission", car.transmission],
                   ["Fuel Type", fuelType],
                   ["Body Type", car.bodyType],
                 ].filter(([, v]) => v).map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex justify-between items-center px-5 py-3.5 ${
                      i % 2 === 0 ? "bg-white/[0.02]" : ""
                    } ${i > 0 ? "border-t border-white/5" : ""}`}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                      {label}
                    </span>
                    <span className="text-sm text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT — Sticky Sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-white/10 bg-white/[0.02] p-6 lg:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600] mb-2">
                {car.condition} &mdash; {car.year}
              </p>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
                {displayName}
              </h1>
              <p className="font-heading text-3xl lg:text-4xl font-bold text-white mb-8">
                GH₵{car.price.toLocaleString()}
              </p>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-4 font-heading font-semibold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-3 mb-4 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/60" />
                </span>
              </a>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 text-center mb-8">
                Verified Agent &mdash; Typically responds within 1 hour
              </p>

              {/* Enquiry Form */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-heading font-semibold text-white text-sm mb-4">
                  Send an enquiry
                </h3>
                {formSent ? (
                  <div className="text-center py-6">
                    <p className="text-[#25D366] font-semibold mb-1">Enquiry sent!</p>
                    <p className="text-xs text-white/40">We'll get back to you shortly.</p>
                    <button
                      onClick={() => setFormSent(false)}
                      className="text-[#E10600] text-xs mt-3 font-mono uppercase tracking-wider hover:underline focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                    />
                    <textarea
                      placeholder="Your message (optional)"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors resize-none"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-[#E10600] text-white px-6 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                      <Send size={14} />
                      {sending ? "Sending…" : "Send Enquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

                {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                className="absolute left-4 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={() => setActiveImage((activeImage + 1) % images.length)}
                className="absolute right-4 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                aria-label="Next image"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img
            src={images[activeImage] || "/ready-car.png"}
            alt={displayName}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}