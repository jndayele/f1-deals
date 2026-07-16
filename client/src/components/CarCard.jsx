import React from "react";
import { motion } from "framer-motion";
import { Gauge, Fuel, Zap, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function CarCard({ car, index = 0, onCompareSelect, selectedForCompare = false }) {
  // Support both backend field names and any legacy shape
  const imageUrl = car.coverPhotoUrl || car.images?.[0] || "/ready-car.png";
  const displayName = car.title || car.name || `${car.year} ${car.make} ${car.model}`;
  const fuelType = car.fuelType || car.fuel;
  const isSold = car.isSold || car.sold || car.status === "Sold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative border bg-white/[0.02] overflow-hidden transition-colors ${
        selectedForCompare ? "border-[#E10600]" : "border-white/10"
      }`}
    >
      {onCompareSelect && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareSelect(car.id);
          }}
          className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none ${
            selectedForCompare
              ? "bg-[#E10600] text-white"
              : "bg-black/60 text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-sm"
          }`}
        >
          <Scale size={11} />
          {selectedForCompare ? "Selected" : "Compare"}
        </button>
      )}
      <Link
        to={`/inventory/${car.id}`}
        className="block focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />

          {isSold && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
              <div className="absolute top-6 -left-10 bg-[#E10600] text-white py-1 px-14 -rotate-45 font-heading font-bold uppercase tracking-wider text-xs">
                Sold
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 lg:p-6">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600]">
                {car.condition} &mdash; {car.year}
              </span>
              <h3 className="font-heading text-lg font-bold mt-1 text-white truncate">
                {displayName}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="font-heading text-xl font-bold text-white">
                GH₵{car.price?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5">
              <Gauge size={13} className="text-white/30" />
              <span className="font-mono text-[11px] text-white/50">
                {car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : "—"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-white/30" />
              <span className="font-mono text-[11px] text-white/50">{car.transmission || "—"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel size={13} className="text-white/30" />
              <span className="font-mono text-[11px] text-white/50">{fuelType || "—"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}