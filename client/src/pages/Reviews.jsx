import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StarRating from "@/components/StarRating";
import { reviewService } from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", rating: 0, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    reviewService.getAll().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) return;
    setSubmitting(true);
    await reviewService.submit(formData);
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", rating: 0, message: "" });
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-14 lg:mb-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E10600] mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-[#E10600]" />
              Reviews
            </p>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white mb-6">
              What our clients say
            </h1>

            {/* Average Rating */}
            {!loading && reviews.length > 0 && (
              <div className="flex items-center gap-5">
                <span className="font-heading text-5xl lg:text-6xl font-bold text-white">
                  {avgRating}
                </span>
                <div>
                  <StarRating rating={Math.round(parseFloat(avgRating))} size={20} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">
                    Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
          {/* Reviews List */}
          <div>
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border border-white/10 p-6 animate-pulse">
                    <div className="h-4 bg-white/5 w-1/4 mb-3" />
                    <div className="h-3 bg-white/5 w-full mb-2" />
                    <div className="h-3 bg-white/5 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <ScrollReveal key={review.id} delay={i * 0.08}>
                    <div className="border border-white/10 p-6 lg:p-8">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-heading font-semibold text-white">
                            {review.name}
                          </h3>
                          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mt-1">
                            {new Date(review.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {review.message}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>

          {/* Leave a Review */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-white/10 bg-white/[0.02] p-6 lg:p-8">
              <h2 className="font-heading text-xl font-bold text-white mb-6">
                Leave a review
              </h2>

              {submitted ? (
                <div className="text-center py-8">
                  <Star size={32} className="fill-[#E10600] text-[#E10600] mx-auto mb-3" />
                  <p className="font-heading font-semibold text-white mb-1">
                    Thank you!
                  </p>
                  <p className="text-sm text-white/40">
                    Your review has been submitted for approval.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#E10600] text-xs mt-4 font-mono uppercase tracking-wider hover:underline focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:outline-none"
                  >
                    Write another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kwame Asante"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                      Rating
                    </label>
                    <StarRating
                      rating={formData.rating}
                      onRate={(r) => setFormData({ ...formData, rating: r })}
                      size={24}
                      interactive
                    />
                    {formData.rating === 0 && (
                      <p className="text-[10px] text-white/20 mt-1">Tap a star to rate</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">
                      Your Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your experience…"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:border-[#E10600] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || formData.rating === 0}
                    className="w-full bg-[#E10600] text-white px-6 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider hover:bg-[#B80500] transition-colors disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}