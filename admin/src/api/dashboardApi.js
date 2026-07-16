import api from './apiClient';

/**
 * Fetch pre-calculated dashboard statistics from the backend.
 * Backend: GET /api/v1/admin/dashboard
 * Returns: {
 *   activeCars, soldCars, archivedCars, totalCars, pendingReviews,
 *   recentListings, inventoryTrends
 * }
 */
export async function getDashboardStats() {
  const { data: body } = await api.get('/admin/dashboard');
  
  // Normalize recentListings field names from backend camelCase to frontend snake_case
  // and handle status strings.
  const stats = body.data;
  
  const statusMap = { 'Available': 'active', 'Sold': 'sold', 'Archived': 'archived' };
  
  if (stats.recentListings) {
    stats.recentListings = stats.recentListings.map(car => ({
      ...car,
      fuel_type: car.fuelType,
      body_type: car.bodyType,
      created_date: car.createdAt,
      sold_date: car.soldAt,
      status: statusMap[car.status] || car.status.toLowerCase(),
    }));
  }

  return stats;
}
