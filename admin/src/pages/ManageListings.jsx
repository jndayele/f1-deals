import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, PlusCircle, Car, Pencil, Trash2, Tag, MoreHorizontal, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useCars } from "@/hooks/useCars";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/lib/socket";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonTable } from "@/components/admin/SkeletonLoader";

const TABS = [
  { key: "active", label: "Active" },
  { key: "sold", label: "Sold" },
  { key: "archived", label: "Archived" },
];

// Custom hook to debounce values (prevents hammering the API on every keystroke)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ManageListings() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const queryClient = useQueryClient();
  useEffect(() => {
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    };

    socket.on('new_listing', invalidate);
    socket.on('car_updated', invalidate);
    socket.on('car_deleted', invalidate);

    return () => {
      socket.off('new_listing', invalidate);
      socket.off('car_updated', invalidate);
      socket.off('car_deleted', invalidate);
    };
  }, [queryClient]);

  const { cars, pagination, isLoading, updateCarStatus, deleteCar } = useCars({ 
    status: activeTab,
    search: debouncedSearch,
    page
  });

  const handleMarkSold = async (car) => {
    await updateCarStatus.mutateAsync({ id: car.id, status: "Sold" });
    toast({ title: `"${car.title}" marked as sold` });
  };

  const handleReactivate = async (car) => {
    await updateCarStatus.mutateAsync({ id: car.id, status: "Available" });
    toast({ title: `"${car.title}" reactivated` });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCar.mutateAsync(deleteTarget.id);
    toast({ title: `"${deleteTarget.title}" deleted` });
    setDeleteTarget(null);
  };

  const getSoldDaysRemaining = (soldDate) => {
    if (!soldDate) return null;
    const sold = new Date(soldDate);
    const archiveDate = new Date(sold.getTime() + 14 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const remaining = Math.ceil((archiveDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, remaining);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
        <Link to="/cars/new">
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Add New Car
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : cars.length === 0 ? (
          <EmptyState
            icon={Car}
            title={debouncedSearch ? "No results found" : `No ${activeTab} listings`}
            description={
              debouncedSearch
                ? "Try a different search term"
                : activeTab === "active"
                ? "Add your first car to get started"
                : undefined
            }
            action={
              activeTab === "active" && !debouncedSearch ? (
                <Link to="/cars/new">
                  <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    <PlusCircle className="w-4 h-4" /> Add New Car
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Car
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Specs
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {car.media?.[0]?.url ? (
                            <img src={car.media[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{car.title}</p>
                          <p className="text-xs text-gray-500">{car.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-gray-600">
                        {[car.transmission, car.fuel_type, car.body_type].filter(Boolean).join(" / ")}
                      </p>
                      {car.mileage && (
                        <p className="text-xs text-gray-500">{car.mileage.toLocaleString()} km</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-900">
                        GHS {car.price?.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={car.status} />
                      {car.status === "sold" && car.sold_date && (
                        <p className="text-[11px] text-amber-600 mt-1">
                          Archives in {getSoldDaysRemaining(car.sold_date)} days
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem asChild>
                            <Link to={`/cars/${car.id}`} className="flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/cars/${car.id}/edit`} className="flex items-center gap-2">
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          {car.status === "available" && (
                            <DropdownMenuItem
                              onClick={() => handleMarkSold(car)}
                              className="flex items-center gap-2"
                            >
                              <Tag className="w-3.5 h-3.5" /> Mark as Sold
                            </DropdownMenuItem>
                          )}
                          {(car.status === "sold" || car.status === "archived") && (
                            <DropdownMenuItem
                              onClick={() => handleReactivate(car)}
                              className="flex items-center gap-2"
                            >
                              <Car className="w-3.5 h-3.5" /> Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(car)}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Footer */}
        {pagination?.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                disabled={pagination.currentPage <= 1 || isLoading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}