import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useReviews(filters = {}) {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", filters],
    queryFn: async () => {
      if (filters.status) {
        return base44.entities.Review.filter({ status: filters.status }, "-created_date");
      }
      return base44.entities.Review.list("-created_date");
    },
  });

  const moderateReview = useMutation({
    mutationFn: ({ id, status }) =>
      base44.entities.Review.update(id, {
        status,
        moderated_date: new Date().toISOString(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error,
    moderateReview,
  };
}