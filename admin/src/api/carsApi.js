import api from './apiClient';

/**
 * Fetch all cars, optionally filtered by status.
 * @param {Object} filters - e.g. { status: 'active' }
 * @returns {Array} cars
 */
export async function getCars(filters = {}) {
  const { data } = await api.get('/cars', { params: filters });
  return data;
}

/**
 * Fetch a single car by ID.
 * @param {string} id
 * @returns {Object} car
 */
export async function getCar(id) {
  const { data } = await api.get(`/cars/${id}`);
  return data;
}

/**
 * Create a new car listing.
 * @param {Object} carData
 * @returns {Object} created car
 */
export async function createCar(carData) {
  const { data } = await api.post('/cars', carData);
  return data;
}

/**
 * Update an existing car listing.
 * @param {string} id
 * @param {Object} updates
 * @returns {Object} updated car
 */
export async function updateCar(id, updates) {
  const { data } = await api.patch(`/cars/${id}`, updates);
  return data;
}

/**
 * Delete a car listing.
 * @param {string} id
 */
export async function deleteCar(id) {
  const { data } = await api.delete(`/cars/${id}`);
  return data;
}
