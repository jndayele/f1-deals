import api from './apiClient';
import { supabase } from '@/lib/supabase';

/**
 * Log in with email and password via Supabase Auth.
 * Supabase manages the session automatically (no localStorage needed).
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Check if there is a valid current Supabase session.
 * @returns {Object|null} the Supabase user object, or null
 */
export async function me() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign out via Supabase Auth.
 */
export async function logout() {
  await supabase.auth.signOut();
}

/**
 * Change the current admin's password.
 * Backend: POST /api/v1/auth/change-password (requireAdmin protected).
 * Note: currentPassword is not needed — Supabase Admin API handles this server-side.
 * @param {string} newPassword
 */
export async function changePassword(newPassword) {
  const { data: body } = await api.post('/auth/change-password', { newPassword });
  return body.data;
}

/**
 * Upload files directly to the backend (multipart/form-data).
 * Backend: POST /api/v1/admin/cars/:id/media
 * @param {File} file
 * @param {number} carId
 */
export async function uploadFile(file, carId) {
  const formData = new FormData();
  formData.append('files', file);
  const { data: body } = await api.post(`/admin/cars/${carId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return body.data;
}

/**
 * Request a password reset email via Supabase Auth.
 * Supabase sends the email automatically — no backend endpoint needed.
 * @param {string} email
 */
export async function forgotPassword(email) {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

/**
 * Update the password after clicking the reset link from email.
 * Supabase sets the session automatically when the user lands on /reset-password
 * with the token in the URL hash — then we call updateUser to set the new password.
 * @param {string} newPassword
 */
export async function resetPassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
