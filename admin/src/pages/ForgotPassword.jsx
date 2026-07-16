import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout
      icon={Mail}
      title="Reset password"
      subtitle="Admin accounts are managed securely"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          <ArrowLeft className="w-3 h-3 inline mr-1" />Back to log in
        </Link>
      }
    >
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed text-center">
        <p>
          Password reset via email is disabled for admin accounts. 
        </p>
        <p className="mt-2">
          If you have forgotten your password, please contact the system administrator or check the database directly.
        </p>
      </div>
    </AuthLayout>
  );
}
