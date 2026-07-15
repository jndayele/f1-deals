import { useQuery } from "@tanstack/react-query";
import * as carsApi from "@/api/carsApi";
import * as reviewsApi from "@/api/reviewsApi";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [allCars, pendingReviews] = await Promise.all([
        carsApi.getCars(),
        reviewsApi.getReviews({ status: "pending" }),
      ]);

      const active = allCars.filter((c) => c.status === "active");
      const sold = allCars.filter((c) => c.status === "sold");
      const archived = allCars.filter((c) => c.status === "archived");
      const recent = allCars.slice(0, 5);

      return {
        activeCars: active.length,
        soldCars: sold.length,
        archivedCars: archived.length,
        totalCars: allCars.length,
        pendingReviews: pendingReviews.length,
        recentListings: recent,
        allCars,
      };
    },
  });
}