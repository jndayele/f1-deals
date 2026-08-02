import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, Loader2, User, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { changePassword, logout } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();


  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await changePassword(newPassword);
      toast({ title: "Password changed successfully. Please log in again." });
      setNewPassword("");
      setConfirmPassword("");
      
      // Log out and redirect
      await logout();
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.error?.message || "Failed to change password";
      toast({ title: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Account</p>
            <p className="text-xs text-gray-500">{user?.email || "Admin"}</p>
          </div>
        </div>

        <div>
          <Label>Email</Label>
          <Input value={user?.email || ""} disabled className="bg-gray-50 mt-1" />
          <p className="text-xs text-gray-500 mt-1">
            Admin accounts are managed directly in the system.
          </p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            <Lock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Security</p>
            <p className="text-xs text-gray-500">Change your password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
              required
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}