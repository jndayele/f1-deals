import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reviewsApi from "@/api/reviewsApi";

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

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error,
    moderateReview,
  };
}