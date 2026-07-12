import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, Loader2, User, Lock, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AdminSettings() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      setUser(me);
      setFullName(me.full_name || "");
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.auth.updateMe({ full_name: fullName });
    toast({ title: "Profile updated" });
    setSaving(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      await base44.auth.resetPasswordRequest(user.email);
      toast({
        title: "Password reset link sent",
        description: `Check ${user.email} for instructions to reset your password.`,
      });
    } catch {
      toast({ title: "Failed to send reset link", variant: "destructive" });
    }
    setSendingReset(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Account</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">
              Contact support to change your email address
            </p>
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="p-2.5 bg-gray-100 rounded-lg">
            <Lock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Security</p>
            <p className="text-xs text-gray-500">Manage your password</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Change Password</p>
            <p className="text-xs text-gray-500 mt-0.5">
              We'll send a secure link to {user?.email} to reset your password
            </p>
          </div>
          <Button
            onClick={handlePasswordReset}
            disabled={sendingReset}
            variant="outline"
            className="gap-2 flex-shrink-0"
          >
            {sendingReset ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Send Reset Link
          </Button>
        </div>
      </div>
    </div>
  );
}