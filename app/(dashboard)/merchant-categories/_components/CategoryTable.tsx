"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreVertical,
  Edit2,
  Power,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { CategoryItem } from "../types";
import { useAppDispatch } from "@/lib/redux/store";
import { MerchantService } from "@/services/MerchantService";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/Pagination";

interface CategoryTableProps {
  categories: CategoryItem[] | null;
  selectedCategoryId: string | null;
  onSelectCategory: (category: CategoryItem) => void;
  onToggleStatus?: (
    categoryId: string,
    nextStatus: "ACTIVE" | "INACTIVE"
  ) => void;
  onDeleteCategory?: (categoryId: string) => void;
  filter: {
    search: string;
    currentPage: number;
    pageSize: number;
    status: string;
    totalPages: number;
  };
  setFilter:any
  onFilterChange: (newFilters: any) => void;
  totalCount?: number;
}

export function CategoryTable({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onToggleStatus,
  onDeleteCategory,
  filter,
  setFilter,
  onFilterChange,
  totalCount = 0,
}: CategoryTableProps) {
  const dispatch = useAppDispatch();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // State for tracking category pending deletion confirmation
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value, currentPage: 1 });
  };

  const handleTabChange = (status: "ALL" | "ACTIVE" | "INACTIVE") => {
    onFilterChange({
      status: status === "ALL" ? "" : status,
      currentPage: 1,
    });
  };

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (e: React.MouseEvent, item: CategoryItem) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onSelectCategory(item);
  };

  const handleStatusToggle = async (
    e: React.MouseEvent,
    item: CategoryItem
  ) => {
    e.stopPropagation();
    setOpenMenuId(null);

    const previousStatus = item.status;
    const nextStatus: "ACTIVE" | "INACTIVE" =
      previousStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    if (onToggleStatus) {
      onToggleStatus(item.id, nextStatus);
    }

    try {
      await MerchantService.updateCategory(item.id, { status: nextStatus });

      dispatch(
        showResponseModal({
          status: "success",
          title: "Status Updated",
          message: `"${item.name}" is now ${nextStatus.toLowerCase()}.`,
          buttonText: "Done",
        })
      );
    } catch (error: any) {
      if (onToggleStatus) {
        onToggleStatus(item.id, previousStatus);
      }

      dispatch(
        showResponseModal({
          status: "error",
          title: "Update Failed",
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update category status. Changes were reverted.",
          buttonText: "Close",
        })
      );
    }
  };

  const handleOpenDeleteConfirm = (e: React.MouseEvent, item: CategoryItem) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setCategoryToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    const item = categoryToDelete;
    setIsDeleting(true);

    try {
      await MerchantService.deleteCategory(item.id);

      if (onDeleteCategory) {
        onDeleteCategory(item.id);
      }

      setCategoryToDelete(null);

      dispatch(
        showResponseModal({
          status: "success",
          title: "Category Deleted",
          message: `Category "${item.name}" (${item.code}) has been deleted successfully.`,
          buttonText: "Done",
        })
      );
    } catch (error: any) {
      dispatch(
        showResponseModal({
          status: "error",
          title: "Delete Failed",
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete category. Please try again.",
          buttonText: "Close",
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const activeTab = filter.status === "" ? "ALL" : filter.status;

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border rounded-2xl p-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or code (e.g. FNB, Retail)"
            value={filter.search}
            onChange={handleSearchChange}
            className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => handleTabChange("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ALL
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("ACTIVE")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ACTIVE"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ACTIVE
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("INACTIVE")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "INACTIVE"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            INACTIVE
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-border bg-card shadow-2xs">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-indigo-50/40 dark:bg-slate-900/60 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">CATEGORY & CODE</th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4 text-center">LINKED MERCHANTS</th>
                <th className="py-3 px-4">DEFAULT TAX RULE</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {categories && categories.length > 0 ? (
                categories.map((item) => {
                  const isSelected = selectedCategoryId === item.id;
                  const isMenuOpen = openMenuId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectCategory(item)}
                      className={`cursor-pointer transition-colors relative ${
                        isSelected
                          ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-l-4 border-l-indigo-600"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                            {item.code}
                          </span>
                          <div>
                            <p className="font-bold text-foreground text-xs">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono">
                              CODE: {item.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-muted-foreground text-[11px] max-w-xs truncate">
                        {item.description}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-foreground block">
                          {item.linkedMerchantCount}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          merchants
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300">
                          {item.defaultTaxPolicy}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold transition-colors ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div
                          className="relative inline-block text-left"
                          ref={isMenuOpen ? menuRef : null}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleMenuToggle(e, item.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                            title="Options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl border border-border bg-card shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                              <button
                                type="button"
                                onClick={(e) => handleEdit(e, item)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Update Category</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleStatusToggle(e, item)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                                  item.status === "ACTIVE"
                                    ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                    : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                }`}
                              >
                                {item.status === "ACTIVE" ? (
                                  <>
                                    <Power className="h-3.5 w-3.5" />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </button>

                              <div className="my-1 border-t border-border/60" />

                              <button
                                type="button"
                                onClick={(e) =>
                                  handleOpenDeleteConfirm(e, item)
                                }
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Category</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      
        <div className="p-3 border-t border-border/80">
          
          <Pagination
          filter={filter}
          setFilter={setFilter}

          
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-foreground">
                  Delete Category
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                "{categoryToDelete.name}" ({categoryToDelete.code})
              </span>
              ?
              {categoryToDelete.linkedMerchantCount > 0 && (
                <span className="block mt-1 text-rose-500 font-semibold">
                  Warning: This sector currently has{" "}
                  {categoryToDelete.linkedMerchantCount} linked merchant(s).
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}