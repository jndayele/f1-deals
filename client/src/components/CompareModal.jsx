import React from "react";
import { X } from "lucide-react";

const COMPARE_FIELDS = [
  { key: "price", label: "Price", format: (v) => `GH₵${v.toLocaleString()}` },
  { key: "year", label: "Year" },
  { key: "condition", label: "Condition" },
  { key: "mileage", label: "Mileage", format: (v) => `${v.toLocaleString()} km` },
  { key: "transmission", label: "Transmission" },
  { key: "fuel", label: "Fuel Type" },
  { key: "bodyType", label: "Body Type" },
  { key: "engine", label: "Engine", nested: true },
  { key: "horsepower", label: "Horsepower", nested: true },
  { key: "torque", label: "Torque", nested: true },
  { key: "drivetrain", label: "Drivetrain", nested: true },
  { key: "seats", label: "Seats", nested: true },
  { key: "color", label: "Color", nested: true },
  { key: "interior", label: "Interior", nested: true },
];

export default function CompareModal({ cars, onClose }) {
  const getValue = (car, field) => {
    const value = field.nested ? car.specs?.[field.key] : car[field.key];
    if (value === undefined || value === null) return "—";
    return field.format ? field.format(value) : String(value);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-start justify-center p-4 lg:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#0A0A0A] border border-white/10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-1">
              Comparison
            </p>
            <h2 className="font-heading text-xl font-bold text-white">
              Side-by-side specifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
            aria-label="Close comparison"
          >
            <X size={24} />
          </button>
        </div>

        {/* Car headers */}
        <div className="grid grid-cols-[80px_1fr_1fr] lg:grid-cols-[160px_1fr_1fr] border-b border-white/10">
          <div className="border-r border-white/10" />
          {cars.map((car) => (
            <div key={car.id} className="p-4 lg:p-5 border-r border-white/10 last:border-r-0">
              <div className="aspect-[16/9] overflow-hidden mb-3 border border-white/10">
                <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-[#E10600] mb-1">
                {car.condition} — {car.year}
              </p>
              <h3 className="font-heading text-sm lg:text-lg font-bold text-white">{car.name}</h3>
              <p className="font-heading text-base lg:text-xl font-bold text-white mt-2">
                GH₵{car.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Specs rows */}
        <div>
          {COMPARE_FIELDS.map((field, i) => (
            <div
              key={field.key}
              className={`grid grid-cols-[80px_1fr_1fr] lg:grid-cols-[160px_1fr_1fr] ${
                i > 0 ? "border-t border-white/5" : ""
              } ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
            >
              <div className="p-3 lg:p-4 border-r border-white/10 flex items-center">
                <span className="font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.15em] text-white/40">
                  {field.label}
                </span>
              </div>
              {cars.map((car, ci) => (
                <div
                  key={car.id}
                  className={`p-3 lg:p-4 border-r border-white/10 last:border-r-0 ${
                    ci > 0 ? "border-l border-white/5" : ""
                  }`}
                >
                  <span className="text-xs lg:text-sm text-white">{getValue(car, field)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}