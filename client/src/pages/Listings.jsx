import React, { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, Scale } from "lucide-react";
import CarCard from "@/components/CarCard";
import CompareModal from "@/components/CompareModal";
import ScrollReveal from "@/components/ScrollReveal";
import { carService } from "@/lib/api";
import socket from "@/lib/socket";
import SEO from "@/components/SEO";

const MAKES = ["All", "Toyota", "Honda", "Mercedes-Benz", "BMW", "Hyundai"];
const BODY_TYPES = ["All", "Sedan", "SUV"];
const CONDITIONS = ["All", "Brand New", "Foreign Used", "Local Used"];
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Debounce search input to avoid hammering the API on every keystroke
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Listings() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [filters, setFilters] = useState({
    make: "All",
    bodyType: "All",
    condition: "All",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleCompareSelect = (carId) => {
    setCompareList((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId);
      if (prev.length >= 2) return [prev[1], carId];
      return [...prev, carId];
    });
  };

  const clearCompare = () => setCompareList([]);
  const comparedCars = cars.filter((c) => compareList.includes(c.id));

  const fetchCars = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (filters.make !== "All") params.make = filters.make;
    if (filters.bodyType !== "All") params.bodyType = filters.bodyType;
    if (filters.condition !== "All") params.condition = filters.condition;
    if (filters.yearMin) params.year = parseInt(filters.yearMin);
    if (filters.priceMin) params.minPrice = parseInt(filters.priceMin);
    if (filters.priceMax) params.maxPrice = parseInt(filters.priceMax);

    carService.getAll(params).then((result) => {
      setCars(result?.items ?? []);
      setLoading(false);
    }).catch(() => {
      setCars([]);
      setLoading(false);
    });
  }, [search, filters]);

  useEffect(() => {
    fetchCars();

    // Real-time: when admin adds a listing, auto-refresh
    socket.on('new_listing', fetchCars);
    return () => socket.off('new_listing', fetchCars);
  }, [fetchCars]);

  const activeFilterCount = Object.entries(filters).filter(
    ([, v]) => v !== "All" && v !== ""
  ).length;

  const clearFilters = () => {
    setFilters({
      make: "All",
      bodyType: "All",
      condition: "All",
      yearMin: "",
      yearMax: "",
      priceMin: "",
      priceMax: "",
    });
    setSearch("");
  };

  return (
    <div className={`bg-[#0A0A0A] min-h-screen pt-24 pb-20 ${compareList.length > 0 ? "pb-32" : ""}`}>
      <SEO
        title="Car Inventory — Buy New & Used Cars in Ghana"
        description="Browse F1 Deals' full inventory of brand new, foreign used, and locally used cars available across Ghana. Filter by make, body type, year, and price. Fast delivery nationwide."
        canonicalPath="/inventory"
        ogImage="/home-page.png"
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-[#E10600]" />
              Inventory
            </p>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white">
              Find your machine
            </h1>
          </div>
        </ScrollReveal>

        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by make, model, or name…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-sm pl-11 pr-4 py-3.5 font-body placeholder:text-white/30 focus:border-[#E10600] focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 border border-white/10 px-5 py-3.5 text-sm font-mono uppercase tracking-wider text-white/70 hover:text-white hover:border-white/30 transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none shrink-0"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#E10600] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border border-white/10 bg-white/[0.02] p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <FilterSelect
                label="Make"
                value={filters.make}
                options={MAKES}
                onChange={(v) => setFilters({ ...filters, make: v })}
              />
              <FilterSelect
                label="Body Type"
                value={filters.bodyType}
                options={BODY_TYPES}
                onChange={(v) => setFilters({ ...filters, bodyType: v })}
              />
              <FilterSelect
                label="Condition"
                value={filters.condition}
                options={CONDITIONS}
                onChange={(v) => setFilters({ ...filters, condition: v })}
              />
              <FilterSelect
                label="Year (Min)"
                value={filters.yearMin}
                options={["", ...YEARS]}
                onChange={(v) => setFilters({ ...filters, yearMin: v })}
              />
              <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                    Price Min (GH₵)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 font-body placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                    Price Max (GH₵)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 font-body placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-[#E10600] transition-colors font-mono uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
          {cars.length} vehicle{cars.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border border-white/10 animate-pulse">
                <div className="aspect-[16/10] bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/5 w-1/3" />
                  <div className="h-6 bg-white/5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 border border-white/10">
            <p className="font-heading text-xl text-white/40 mb-2">No vehicles found</p>
            <p className="text-sm text-white/20">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car, i) => (
              <CarCard
                key={car.id}
                car={car}
                index={i}
                onCompareSelect={handleCompareSelect}
                selectedForCompare={compareList.includes(car.id)}
              />
            ))}
          </div>
        )}

        {/* Comparison Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A] border-t border-[#E10600]/30 px-6 py-4">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Scale size={18} className="text-[#E10600] shrink-0" />
                <span className="font-mono text-xs uppercase tracking-wider text-white/60 shrink-0">
                  {compareList.length}/2 selected
                </span>
                <div className="hidden sm:flex items-center gap-3 ml-4 min-w-0">
                  {comparedCars.map((c) => (
                    <span key={c.id} className="text-sm text-white/80 truncate">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={clearCompare}
                  className="text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowCompare(true)}
                  disabled={compareList.length < 2}
                  className="bg-[#E10600] text-white px-6 py-2.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  Compare
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && comparedCars.length === 2 && (
          <CompareModal cars={comparedCars} onClose={() => setShowCompare(false)} />
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 font-body focus:border-[#E10600] focus:outline-none transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0A0A0A]">
            {opt === "" ? `Any` : opt}
          </option>
        ))}
      </select>
    </div>
  );
}