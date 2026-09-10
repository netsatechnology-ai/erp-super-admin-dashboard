"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, Edit2, Power, CheckCircle2 } from "lucide-react";
import { CategoryItem } from "../types";
import { useAppDispatch } from "@/lib/redux/store";
import { MerchantService } from "@/services/MerchantService";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";

interface CategoryTableProps {
  categories: CategoryItem[] | null;
  selectedCategoryId: string | null;
  onSelectCategory: (category: CategoryItem) => void;
  onToggleStatus?: (categoryId: string, nextStatus: "ACTIVE" | "INACTIVE") => void;
}

export function CategoryTable({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onToggleStatus,
}: CategoryTableProps) {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  const filteredCategories = categories?.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "ACTIVE") return matchesSearch && cat.status === "ACTIVE";
    if (activeTab === "INACTIVE") return matchesSearch && cat.status === "INACTIVE";
    return matchesSearch;
  });

  const activeCount = categories?.filter((c) => c.status === "ACTIVE").length || 0;
  const deactivatedCount = categories?.filter((c) => c.status === "INACTIVE").length || 0;

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (e: React.MouseEvent, item: CategoryItem) => {
    console.log("itemitemitem",item)
    e.stopPropagation();
    setOpenMenuId(null);
    onSelectCategory(item);
  };

  const handleStatusToggle = async (e: React.MouseEvent, item: CategoryItem) => {
    e.stopPropagation();
    setOpenMenuId(null);

    const previousStatus = item.status;
    const nextStatus: "ACTIVE" | "INACTIVE" =
      previousStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // 1. OPTIMISTIC UPDATE: Update UI immediately
    if (onToggleStatus) {
      onToggleStatus(item.id, nextStatus);
    }

    try {
      // 2. Perform API request in background
      await MerchantService.updateCategory(item.id, {status:nextStatus});

      // Success notification (non-blocking)
      dispatch(
        showResponseModal({
          status: "success",
          title: "Status Updated",
          message: `"${item.name}" is now ${nextStatus.toLowerCase()}.`,
          buttonText: "Done",
        })
      );
    } catch (error: any) {
      // 3. REVERT STATE on error
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

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border rounded-2xl p-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or code (e.g. FNB, Retail)"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ALL ({categories?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ACTIVE")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ACTIVE"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ACTIVE ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("INACTIVE")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "INACTIVE"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            INACTIVE ({deactivatedCount})
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
              {filteredCategories?.map((item) => {
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
                          <p className="font-bold text-foreground text-xs">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">CODE: {item.code}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground text-[11px] max-w-xs truncate">
                      {item.description}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-foreground block">{item.linkedMerchantCount}</span>
                      <span className="text-[10px] text-muted-foreground">merchants</span>
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
                      <div className="relative inline-block text-left" ref={isMenuOpen ? menuRef : null}>
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
                                  ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
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
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/80 bg-muted/20 text-[10px] font-mono text-muted-foreground">
          <span>
            Showing {filteredCategories?.length || 0} of {categories?.length || 0} sectors registered
          </span>
          <span>NPO-CAT-V2.5 REV: 2025.02</span>
        </div>
      </div>
    </div>
  );
}