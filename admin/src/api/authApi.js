import api from './apiClient';

/**
 * Log in with email and password.
 *
 * Backend: POST /api/v1/auth/login
 * Response: { success: true, data: { token, expiresIn } }
 *
 * Stores the returned JWT token in localStorage.
 * @returns {{ token: string, expiresIn: string }}
 */
export async function login(email, password) {
  const { data: body } = await api.post('/auth/login', { email, password });
  // body = { success: true, data: { token, expiresIn } }
  const { token, expiresIn } = body.data;
  localStorage.setItem('auth_token', token);
  return { token, expiresIn };
}

/**
 * Verify the token is still valid by calling change-password endpoint
 * with a no-op body — we only need a 200/401 signal.
 *
 * NOTE: The backend has no /me endpoint. Token validation is done
 * by hitting any requireAdmin-protected endpoint. We store the
 * admin email at login time and restore it from localStorage.
 *
 * @returns {Object} stored admin profile from localStorage
 */
export async function me() {
  // Try hitting a protected endpoint to confirm the token works
  // We use a lightweight HEAD-style approach — list cars with page=1&pageSize=1
  await api.get('/admin/cars', { params: { pageSize: 1 } });
  // If we get here, the token is valid — return stored profile
  const stored = localStorage.getItem('auth_user');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Log out the current user, clearing local storage.
 * Backend has no logout endpoint — JWT is stateless.
 */
export async function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

/**
 * Change the current admin's password.
 * Backend: POST /api/v1/auth/change-password
 * Requires: { currentPassword, newPassword }
 */
export async function changePassword(currentPassword, newPassword) {
  const { data: body } = await api.post('/auth/change-password', { currentPassword, newPassword });
  return body.data;
}

/**
 * Upload files directly to the backend (multipart/form-data).
 * Backend: POST /api/v1/admin/cars/:id/media
 * NOTE: File upload is tied to a specific car. During car creation,
 * media is uploaded after the car is created. See carsApi.js for the
 * uploadCarMedia helper.
 *
 * @param {File} file
 * @param {number} carId
 */
export async function uploadFile(file, carId) {
  const formData = new FormData();
  formData.append('files', file);
  const { data: body } = await api.post(`/admin/cars/${carId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // Returns array of created media objects: [{ id, carId, isPhoto, url, order }]
  return body.data;
}

/**
 * Request a password reset email.
 * Backend: POST /api/v1/auth/forgot-password
 * @param {string} email
 */
export async function forgotPassword(email) {
  const { data: body } = await api.post('/auth/forgot-password', { email });
  return body;
}

/**
 * Reset password using a token.
 * Backend: POST /api/v1/auth/reset-password
 * @param {string} token
 * @param {string} newPassword
 */
export async function resetPassword(token, newPassword) {
  const { data: body } = await api.post('/auth/reset-password', { token, newPassword });
  return body;
}
