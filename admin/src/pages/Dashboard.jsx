import React from "react";
import { Link } from "react-router-dom";
import { Car, CheckCircle, Archive, MessageSquare, PlusCircle, ArrowRight } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { SkeletonCard, SkeletonRow } from "@/components/admin/SkeletonLoader";
import InventoryChart from "@/components/admin/InventoryChart";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your dealership</p>
        </div>
        <Link to="/cars/new">
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Add New Car
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Listings"
            value={data?.activeCars || 0}
            icon={Car}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard
            label="Sold"
            value={data?.soldCars || 0}
            icon={CheckCircle}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            label="Archived"
            value={data?.archivedCars || 0}
            icon={Archive}
            color="text-gray-600"
            bgColor="bg-gray-100"
          />
          <StatCard
            label="Pending Reviews"
            value={data?.pendingReviews || 0}
            icon={MessageSquare}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
        </div>
      )}

      {!isLoading && <InventoryChart trends={data?.inventoryTrends || []} />}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Listings</h2>
          <Link
            to="/cars"
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : data?.recentListings?.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {data.recentListings.map((car) => (
              <Link
                key={car.id}
                to={`/cars/${car.id}/edit`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {car.media?.[0]?.url ? (
                    <img
                      src={car.media[0].url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {car.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    GHS {car.price?.toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={car.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-gray-500">
            No listings yet. Add your first car to get started.
          </div>
        )}
      </div>
    </div>
  );
}