import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/dashboardApi";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // The backend does all the heavy lifting and returns exactly what we need
      return await getDashboardStats();
    },
    staleTime: 60 * 1000, // Cache for 1 minute
  });
}