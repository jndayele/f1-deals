import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as carsApi from "@/api/carsApi";

export function useCars(filters = {}) {
  const queryClient = useQueryClient();

  const carsQuery = useQuery({
    queryKey: ["cars", filters],
    queryFn: () => carsApi.getCars(filters),
  });

  const createCar = useMutation({
    mutationFn: (data) => carsApi.createCar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  const updateCar = useMutation({
    mutationFn: ({ id, data }) => carsApi.updateCar(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  const updateCarStatus = useMutation({
    mutationFn: ({ id, status }) => carsApi.updateCarStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  const deleteCar = useMutation({
    mutationFn: (id) => carsApi.deleteCar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  return {
    cars: carsQuery.data?.cars || [],
    pagination: carsQuery.data?.pagination || { currentPage: 1, totalPages: 1 },
    isLoading: carsQuery.isLoading,
    error: carsQuery.error,
    createCar,
    updateCar,
    updateCarStatus,
    deleteCar,
  };
}

export function useCar(id) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => carsApi.getCar(id),
    enabled: !!id,
  });
}