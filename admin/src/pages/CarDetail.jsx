import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Car as CarIcon,
  Gauge,
  Fuel,
  Settings2,
  Calendar,

  CheckCircle,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCar } from "@/hooks/useCars";
import StatusBadge from "@/components/admin/StatusBadge";
import { SkeletonRow } from "@/components/admin/SkeletonLoader";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, isLoading } = useCar(id);
  const [activeMedia, setActiveMedia] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-500">Car not found.</p>
        <Link to="/cars" className="text-red-600 hover:underline mt-2 inline-block">
          Back to listings
        </Link>
      </div>
    );
  }

  const specs = [
    { label: "Make", value: car.make, icon: CarIcon },
    { label: "Model", value: car.model, icon: CarIcon },
    { label: "Year", value: car.year, icon: Calendar },
    { label: "Mileage", value: car.mileage ? `${car.mileage.toLocaleString()} km` : null, icon: Gauge },
    { label: "Transmission", value: car.transmission, icon: Settings2 },
    { label: "Fuel Type", value: car.fuel_type, icon: Fuel },
    { label: "Body Type", value: car.body_type, icon: CarIcon },
    { label: "Condition", value: car.condition, icon: CheckCircle },
  ].filter((s) => s.value);

  const media = car.media || [];
  const currentMedia = media[activeMedia];

  const goPrev = () => setActiveMedia((i) => (i - 1 + media.length) % media.length);
  const goNext = () => setActiveMedia((i) => (i + 1) % media.length);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cars")}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{car.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={car.status} />
              <span className="text-sm font-semibold text-gray-900">
                GHS {car.price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <Link to={`/cars/${car.id}/edit`}>
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </div>

      {media.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="relative aspect-video bg-gray-900">
            {currentMedia?.type === "video" ? (
              <video
                src={currentMedia.url}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={car.title}
                className="w-full h-full object-contain"
              />
            )}
            {media.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                  {activeMedia + 1} / {media.length}
                </span>
              </>
            )}
          </div>
          {media.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {media.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === activeMedia ? "border-red-500" : "border-transparent"
                  }`}
                >
                  {item.type === "video" ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Film className="w-5 h-5 text-white/60" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {car.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {car.description}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Specifications
            </h2>
            <dl className="space-y-3">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div key={spec.label} className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <Icon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <dt className="text-xs text-gray-500 flex-1">{spec.label}</dt>
                    <dd className="text-sm font-medium text-gray-900">{spec.value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Listing Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-gray-900">
                  GHS {car.price?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={car.status} />
              </div>
              {car.sold_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sold Date</span>
                  <span className="text-gray-900">
                    {new Date(car.sold_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Listed</span>
                <span className="text-gray-900">
                  {car.created_date
                    ? new Date(car.created_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}