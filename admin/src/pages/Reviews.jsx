import React, { useState } from "react";
import { MessageSquare, CheckCircle, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useReviews } from "@/hooks/useReviews";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonTable } from "@/components/admin/SkeletonLoader";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();
  const { reviews, isLoading, moderateReview } = useReviews({ status: activeTab });

  const handleModerate = async (id, status) => {
    await moderateReview.mutateAsync({ id, status });
    toast({
      title: `Review ${status}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>

      <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonTable rows={4} />
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={MessageSquare}
            title={`No ${activeTab} reviews`}
            description={
              activeTab === "pending"
                ? "New reviews from customers will appear here for your approval"
                : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {review.reviewer_name}
                    </p>
                    <StarRating rating={review.rating} />
                    <StatusBadge status={review.status} />
                  </div>
                  {review.reviewer_email && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {review.reviewer_email}
                    </p>
                  )}
                </div>
                {review.car_title && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                    {review.car_title}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                {review.comment}
              </p>

              {activeTab === "pending" && (
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => handleModerate(review.id, "approved")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleModerate(review.id, "rejected")}
                    className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </Button>
                </div>
              )}

              {review.moderated_date && (
                <p className="text-[11px] text-gray-400">
                  Moderated on{" "}
                  {new Date(review.moderated_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}