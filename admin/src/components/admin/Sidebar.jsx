import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  MessageSquare,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";


const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Add New Car", path: "/cars/new", icon: PlusCircle },
  { label: "Manage Listings", path: "/cars", icon: Car },
  { label: "Reviews", path: "/reviews", icon: MessageSquare },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const location = useLocation();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/cars/new") return location.pathname === "/cars/new";
    if (path === "/cars") {
      return (
        location.pathname === "/cars" ||
        (location.pathname.startsWith("/cars/") &&
          !location.pathname.includes("/new"))
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-gray-950 text-white z-50 transition-all duration-300 flex flex-col w-60 ${
          collapsed ? "lg:w-16" : "lg:w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center flex-shrink-0 font-bold text-white text-xs">
            F1
          </div>
          <span className={`font-bold text-lg tracking-tight ${collapsed ? "lg:hidden" : ""}`}>
            F1 Deals
          </span>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}