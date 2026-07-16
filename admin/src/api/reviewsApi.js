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
  const params = { ...filters };
  if (params.status) {
    const map = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };
    params.status = map[params.status.toLowerCase()] || params.status;
  }

  const { data: body } = await api.get('/admin/reviews', { params });
  const reviews = body.data?.items ?? body.data?.reviews ?? (Array.isArray(body.data) ? body.data : []);
  return {
    reviews: Array.isArray(reviews) ? reviews.map(normalizeReview) : [],
    pagination: {
      totalCount: body.data?.totalCount || 0,
      totalPages: Math.ceil((body.data?.totalCount || 0) / (body.data?.pageSize || 10)) || 1,
      currentPage: body.data?.currentPage || 1,
      pageSize: body.data?.pageSize || 10
    }
  };
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
