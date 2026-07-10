import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating, onRate, size = 18, interactive = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onRate(star) : undefined}
          disabled={!interactive}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none`}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : undefined}
        >
          <Star
            size={size}
            className={star <= rating ? "fill-[#E10600] text-[#E10600]" : "text-white/20"}
          />
        </button>
      ))}
    </div>
  );
}