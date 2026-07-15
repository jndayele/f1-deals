import api from './apiClient';

/**
 * Log in with email and password.
 * Stores the returned JWT token in localStorage.
 * @returns {{ user, token }}
 */
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  return data;
}

/**
 * Fetch the currently authenticated user.
 * @returns {Object} user
 */
export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}

/**
 * Log out the current user, clearing local storage.
 */
export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // Best-effort — clear local state regardless
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * Request a password reset email.
 * @param {string} email
 */
export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

/**
 * Complete a password reset using the token from the email link.
 * @param {string} token - Reset token from URL query param
 * @param {string} newPassword
 */
export async function resetPassword(token, newPassword) {
  const { data } = await api.post('/auth/reset-password', { token, newPassword });
  return data;
}

/**
 * Update the current user's profile.
 * @param {Object} updates - e.g. { full_name: 'John Doe' }
 */
export async function updateMe(updates) {
  const { data } = await api.patch('/auth/me', updates);
  return data;
}

/**
 * Upload a single file (image or video) to the backend.
 * @param {File} file
 * @returns {{ file_url: string }}
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // Expected: { file_url: 'https://...' }
}
