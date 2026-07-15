import api from './apiClient';

/**
 * Fetch all reviews, optionally filtered by status.
 * @param {Object} filters - e.g. { status: 'pending' }
 * @returns {Array} reviews
 */
export async function getReviews(filters = {}) {
  const { data } = await api.get('/reviews', { params: filters });
  return data;
}

/**
 * Update a review's status (approve or reject).
 * @param {string} id
 * @param {string} status - 'approved' | 'rejected'
 * @returns {Object} updated review
 */
export async function moderateReview(id, status) {
  const { data } = await api.patch(`/reviews/${id}`, {
    status,
    moderated_date: new Date().toISOString(),
  });
  return data;
}
