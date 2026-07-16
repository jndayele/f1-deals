import { Navigate } from "react-router-dom";

/**
 * The backend does not support email-based password resets for admins.
 * This route is obsolete. Redirecting to login.
 */
export default function ResetPassword() {
  return <Navigate to="/login" replace />;
}
