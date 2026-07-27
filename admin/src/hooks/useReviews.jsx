import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import * as reviewsApi from "@/api/reviewsApi";
import socket from "@/lib/socket";

export function useReviews(filters = {}) {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", filters],
    queryFn: () => reviewsApi.getReviews(filters),
  });

  const moderateReview = useMutation({
    mutationFn: ({ id, status }) => reviewsApi.moderateReview(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  // Real-time: when a user submits a review, auto-refresh the admin list
  useEffect(() => {
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    };
    socket.on("new_review", invalidate);
    socket.on("review_moderated", invalidate);
    return () => {
      socket.off("new_review", invalidate);
      socket.off("review_moderated", invalidate);
    };
  }, [queryClient]);

  return {
    reviews: reviewsQuery.data?.reviews || [],
    pagination: reviewsQuery.data?.pagination || { currentPage: 1, totalPages: 1 },
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error,
    moderateReview,
  };
}