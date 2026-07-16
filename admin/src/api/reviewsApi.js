import api from './apiClient';

/**
 * Backend review field mapping:
 *  name       → reviewer_name
 *  message    → comment
 *  createdAt  → created_date
 *  status     ← 'Pending' | 'Approved' | 'Rejected'  (PascalCase)
 *
 * Response envelope: { success: true, data: { reviews: [...], pagination: {...} } }
 */

function normalizeReview(review) {
  return {
    ...review,
    reviewer_name: review.name ?? review.reviewer_name,
    comment: review.message ?? review.comment,
    created_date: review.createdAt ?? review.created_date,
    moderated_date: review.updatedAt ?? review.moderated_date,
    // Status: UI uses lowercase
    status: review.status ? review.status.toLowerCase() : review.status,
  };
}

/**
 * Fetch reviews.
 * Admin endpoint only returns Pending reviews (GET /api/v1/admin/reviews).
 * For Approved/Rejected we fall back to public endpoint with status filter.
 * @param {Object} filters - e.g. { status: 'pending' }
 * @returns {Array} reviews
 */
export async function getReviews(filters = {}) {
  const status = filters.status?.toLowerCase();

  if (!status || status === 'pending') {
    // Admin endpoint only returns Pending
    const { data: body } = await api.get('/admin/reviews');
    const reviews = body.data?.reviews ?? body.data?.items ?? (Array.isArray(body.data) ? body.data : []);
    return reviews.map(normalizeReview);
  }

  // For approved/rejected — use public endpoint with status filter
  const statusMap = { approved: 'Approved', rejected: 'Rejected' };
  const { data: body } = await api.get('/reviews', {
    params: { status: statusMap[status] || status }
  });
  const reviews = body.data?.reviews ?? body.data?.items ?? (Array.isArray(body.data) ? body.data : []);
  return reviews.map(normalizeReview);
}

/**
 * Update a review's status (approve or reject).
 * Backend: PATCH /api/v1/admin/reviews/:id/status { status: 'Approved'|'Rejected' }
 * @param {string|number} id
 * @param {string} status - 'approved' | 'rejected'
 * @returns {Object} updated review
 */
export async function moderateReview(id, status) {
  const statusMap = { approved: 'Approved', rejected: 'Rejected' };
  const backendStatus = statusMap[status.toLowerCase()] || status;
  const { data: body } = await api.patch(`/admin/reviews/${id}/status`, { status: backendStatus });
  return normalizeReview(body.data);
}
