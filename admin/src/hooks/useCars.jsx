import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useCars(filters = {}) {
  const queryClient = useQueryClient();

  const carsQuery = useQuery({
    queryKey: ["cars", filters],
    queryFn: async () => {
      if (filters.status) {
        return base44.entities.Car.filter({ status: filters.status }, "-created_date");
      }
      return base44.entities.Car.list("-created_date");
    },
  });

  const createCar = useMutation({
    mutationFn: (data) => base44.entities.Car.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  const updateCar = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Car.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  const deleteCar = useMutation({
    mutationFn: (id) => base44.entities.Car.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  return {
    cars: carsQuery.data || [],
    isLoading: carsQuery.isLoading,
    error: carsQuery.error,
    createCar,
    updateCar,
    deleteCar,
  };
}

export function useCar(id) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => base44.entities.Car.get(id),
    enabled: !!id,
  });
}