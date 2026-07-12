import React from "react";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  sold: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
        STATUS_STYLES[status] || STATUS_STYLES.active
      }`}
    >
      {status}
    </span>
  );
}