import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Inventory", path: "/inventory" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Reviews", path: "/reviews" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/f1deals logo.jpeg" alt="F1 Deals" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-mono uppercase tracking-widest transition-colors hover:text-[#E10600] focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none rounded px-1 ${
                  location.pathname === link.path ? "text-[#E10600]" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href={getWhatsAppLink("Hi F1 Deals, I'd like to enquire about your vehicles.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 bg-[#E10600] text-white px-5 py-2.5 text-sm font-heading font-semibold uppercase tracking-wider hover:bg-[#B80500] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <Phone size={14} />
            Contact Us
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2 focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-t border-white/10">
          <div className="px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-mono uppercase tracking-widest py-3 border-b border-white/5 transition-colors hover:text-[#E10600] focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none ${
                  location.pathname === link.path ? "text-[#E10600]" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={getWhatsAppLink("Hi F1 Deals, I'd like to enquire about your vehicles.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-[#E10600] text-white px-5 py-3 text-sm font-heading font-semibold uppercase tracking-wider hover:bg-[#B80500] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <Phone size={14} />
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}