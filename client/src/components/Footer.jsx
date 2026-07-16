import React from "react";
import { Link } from "react-router-dom";
import { getWhatsAppLink } from "@/lib/constants";


export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      {/* Footer CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E10600] mb-4">
                Ready to move?
              </p>
              <h2 className="font-heading text-3xl lg:text-5xl font-bold text-white leading-tight">
                Find your next<br />vehicle today.
              </h2>
            </div>
            <a
              href={getWhatsAppLink("Hi F1 Deals, I'm looking for a vehicle. Can you help?")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E10600] text-white px-8 py-4 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none inline-block"
            >
              Start on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src="/f1deals logo.jpeg" alt="F1 Deals" className="h-16 w-auto mb-4" />
            <p className="text-sm text-white/50 leading-relaxed">
              Ghana's premier nationwide car broker. Buy, sell, swap, and ship vehicles with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E10600] mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "Inventory", path: "/inventory" },
                { label: "Services", path: "/services" },
                { label: "About", path: "/about" },
                { label: "Reviews", path: "/reviews" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-white/50 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E10600] mb-4">
              Services
            </h4>
            <div className="flex flex-col gap-2">
              {["Car Buying", "Car Selling", "Car Swapping", "Car Shipping", "Maintenance", "Parts"].map(
                (s) => (
                  <Link
                    key={s}
                    to="/services"
                    className="text-sm text-white/50 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                  >
                    {s}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E10600] mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={getWhatsAppLink("Hi F1 Deals!")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                WhatsApp — 055 436 7094
              </a>
              <a
                href="https://instagram.com/f1_deals_45"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                Instagram — @f1_deals_45
              </a>
              <a
                href="https://tiktok.com/@f1_deals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
              >
                TikTok — @f1_deals
              </a>
              <span className="text-sm text-white/50">
                Snapchat — F1 DEALS
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} F1 Deals. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Serving Ghana Nationwide
          </p>
        </div>
      </div>
    </footer>
  );
}