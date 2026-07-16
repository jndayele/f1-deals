import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function InventoryChart({ trends = [] }) {
  // We no longer need to useMemo to calculate the trends from raw cars;
  // the backend provides it perfectly pre-formatted.
  
  // If the backend returns the array in descending time (newest first), reverse it for the chart (left to right = old to new)
  // Let's ensure it's left to right
  const data = [...trends].reverse(); 

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">Inventory Trends</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Listings added and cars sold over the last 6 months
        </p>
      </div>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="added"
              name="Listings Added"
              stroke="#dc2626"
              fillOpacity={1}
              fill="url(#colorAdded)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="sold"
              name="Cars Sold"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorSold)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}