import React, { useState, useEffect } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import StarRating from "@/components/StarRating";
import { reviewService } from "@/lib/api";
import socket from "@/lib/socket";
import SEO from "@/components/SEO";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState("0.0");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", rating: 0, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReviews = () => {
    reviewService.getAll().then((data) => {
      setReviews(data?.items || []);
      setAverageRating(data?.averageRating?.toFixed(1) || "0.0");
      setTotalCount(data?.totalApprovedCount || 0);
      setSubmitted(data?.hasPendingReview || false);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReviews();

    const handleReviewModerated = (review) => {
      setReviews((prev) => {
        if (prev.some((r) => r.id === review.id)) {
          return prev.map((r) => (r.id === review.id ? review : r));
        }
        return [review, ...prev];
      });
      // Increment total count optimistically if it's new
      setTotalCount((prev) => prev + 1);
    };

    socket.on('review_moderated', handleReviewModerated);

    return () => {
      socket.off('review_moderated', handleReviewModerated);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) return;
    setSubmitting(true);
    setErrorMsg("");
    
    try {
      await reviewService.submit(formData);
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", rating: 0, message: "" });
    } catch (err) {
      setSubmitting(false);
      if (err.response?.data?.error?.code === 'ALREADY_SUBMITTED') {
        setSubmitted(true);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      <SEO
        title="Customer Reviews — Real Experiences with F1 Deals"
        description="Read verified reviews from F1 Deals customers across Ghana. See why hundreds of Ghanaians trust us to buy, sell, and swap their cars. Share your own experience too."
        canonicalPath="/reviews"
        ogImage="/home-page.png"
      />
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
            {!loading && totalCount > 0 && (
              <div className="flex items-center gap-5">
                <span className="font-heading text-5xl lg:text-6xl font-bold text-white">
                  {averageRating}
                </span>
                <div>
                  <StarRating rating={Math.round(parseFloat(averageRating))} size={20} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">
                    Based on {totalCount} review{totalCount !== 1 ? "s" : ""}
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
                            {new Date(review.createdAt || Date.now()).toLocaleDateString("en-GB", {
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
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
                  <p className="font-heading font-semibold text-white mb-1">
                    Review submitted!
                  </p>
                  <p className="text-sm text-white/40">
                    Your review is pending approval. Once approved, the form will reappear and your review will be visible here.
                  </p>
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
                  
                  {errorMsg && (
                    <div className="p-3 bg-[#E10600]/20 border border-[#E10600]/50 text-white text-xs">
                      {errorMsg}
                    </div>
                  )}

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