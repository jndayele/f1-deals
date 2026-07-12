import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [allCars, pendingReviews] = await Promise.all([
        base44.entities.Car.list("-created_date"),
        base44.entities.Review.filter({ status: "pending" }),
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