import api from './apiClient';

/**
 * Backend car field mapping (camelCase Prisma → snake_case used in old base44):
 *  fuelType   ← fuel_type
 *  bodyType   ← body_type
 *  createdAt  ← created_date
 *  soldAt     ← sold_date
 *  status     ← 'Available' | 'Sold' | 'Archived'  (capital first letter)
 *
 * Response envelope: { success: true, data: { cars: [...], pagination: {...} } }
 *                 or { success: true, data: <car object> }
 */

/**
 * Normalise a car from the backend into the shape the admin UI expects.
 * Converts PascalCase/camelCase backend fields → snake_case UI fields.
 */
function normalizeCar(car) {
  return {
    ...car,
    // Field name aliases expected by the UI components
    fuel_type: car.fuelType ?? car.fuel_type,
    body_type: car.bodyType ?? car.body_type,
    created_date: car.createdAt ?? car.created_date,
    sold_date: car.soldAt ?? car.sold_date,
    // Status: backend uses 'Available' / 'Sold' / 'Archived' — UI uses lowercase
    status: car.status ? car.status.toLowerCase() : car.status,
    // Media: backend returns CarMedia array with { id, url, isPhoto, order }
    // UI expects [{ url, type: 'image'|'video' }]
    media: (car.media || []).map(m => ({
      ...m,
      type: m.isPhoto ? 'image' : 'video',
    })),
  };
}

/**
 * Normalise a car payload going TO the backend.
 * Converts snake_case UI fields → camelCase backend fields.
 * Also maps lowercase status → backend PascalCase.
 */
function denormalizeCar(data) {
  const statusMap = { active: 'Available', available: 'Available', sold: 'Sold', archived: 'Archived' };
  const out = { ...data };
  if (data.fuel_type !== undefined) { out.fuelType = data.fuel_type; delete out.fuel_type; }
  if (data.body_type !== undefined) { out.bodyType = data.body_type; delete out.body_type; }
  if (data.status) out.status = statusMap[data.status.toLowerCase()] || data.status;
  // Remove UI-only fields the backend doesn't expect
  delete out.created_date;
  delete out.sold_date;
  delete out.media; // media is uploaded separately
  return out;
}

/**
 * List cars. Admin endpoint returns paginated response.
 * Filters: { status } — status is converted to backend enum automatically.
 * @returns {Array} cars
 */
export async function getCars(filters = {}) {
  const params = { ...filters };
  // Map lowercase status to backend enum
  if (params.status) {
    const map = { active: 'Available', available: 'Available', sold: 'Sold', archived: 'Archived' };
    params.status = map[params.status.toLowerCase()] || params.status;
  }
  const { data: body } = await api.get('/admin/cars', { params });
  // body.data is { cars: [...], pagination: {} }
  const cars = body.data?.cars ?? body.data ?? [];
  return Array.isArray(cars) ? cars.map(normalizeCar) : [];
}

/**
 * Fetch a single car by ID.
 * NOTE: Backend has no GET /admin/cars/:id endpoint — use the public one.
 * @param {string|number} id
 * @returns {Object} car
 */
export async function getCar(id) {
  const { data: body } = await api.get(`/cars/${id}`);
  return normalizeCar(body.data);
}

/**
 * Create a new car listing.
 * @param {Object} carData - snake_case UI fields
 * @returns {Object} created car
 */
export async function createCar(carData) {
  const payload = denormalizeCar(carData);
  const { data: body } = await api.post('/admin/cars', payload);
  return normalizeCar(body.data);
}

/**
 * Update an existing car listing.
 * @param {string|number} id
 * @param {Object} updates - snake_case UI fields
 * @returns {Object} updated car
 */
export async function updateCar(id, updates) {
  const payload = denormalizeCar(updates);
  const { data: body } = await api.put(`/admin/cars/${id}`, payload);
  return normalizeCar(body.data);
}

/**
 * Change a car's status (marks as sold/archived/active).
 * Backend: PATCH /api/v1/admin/cars/:id/status { status: 'Available'|'Sold'|'Archived' }
 */
export async function updateCarStatus(id, status) {
  const statusMap = { active: 'Available', available: 'Available', sold: 'Sold', archived: 'Archived' };
  const backendStatus = statusMap[status.toLowerCase()] || status;
  const { data: body } = await api.patch(`/admin/cars/${id}/status`, { status: backendStatus });
  return normalizeCar(body.data);
}

/**
 * Delete a car listing.
 * @param {string|number} id
 */
export async function deleteCar(id) {
  const { data: body } = await api.delete(`/admin/cars/${id}`);
  return body.data;
}

/**
 * Upload media files for a car.
 * Backend: POST /api/v1/admin/cars/:id/media (multipart/form-data, field: 'files')
 * @param {number} carId
 * @param {File[]} files
 * @returns {Array} uploaded media objects
 */
export async function uploadCarMedia(carId, files) {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  const { data: body } = await api.post(`/admin/cars/${carId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return body.data;
}

/**
 * Reorder a car's media.
 * Backend: PUT /api/v1/admin/cars/:id/media/reorder { orderedMediaIds: [1,2,3] }
 * @param {number} carId
 * @param {number[]} orderedMediaIds
 */
export async function reorderCarMedia(carId, orderedMediaIds) {
  const { data: body } = await api.put(`/admin/cars/${carId}/media/reorder`, { orderedMediaIds });
  return body.data;
}
