"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, Edit2, Power, CheckCircle2 } from "lucide-react";
import { CategoryItem } from "../types";

interface CategoryTableProps {
  categories: CategoryItem[];
  selectedCategoryId: string | null;
  onSelectCategory: (category: CategoryItem) => void;
  onToggleStatus?: (categoryId: string, currentStatus: "ACTIVE" | "DEACTIVATED") => void;
}

export function CategoryTable({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onToggleStatus,
}: CategoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "DEACTIVATED">("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "ACTIVE") return matchesSearch && cat.status === "ACTIVE";
    if (activeTab === "DEACTIVATED") return matchesSearch && cat.status === "DEACTIVATED";
    return matchesSearch;
  });

  const activeCount = categories.filter((c) => c.status === "ACTIVE").length;
  const deactivatedCount = categories.filter((c) => c.status === "DEACTIVATED").length;

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (e: React.MouseEvent, item: CategoryItem) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onSelectCategory(item);
  };

  const handleStatusToggle = (e: React.MouseEvent, item: CategoryItem) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (onToggleStatus) {
      onToggleStatus(item.id, item.status);
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
            ALL ({categories.length})
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
            onClick={() => setActiveTab("DEACTIVATED")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "DEACTIVATED"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            DEACTIVATED ({deactivatedCount})
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
              {filteredCategories.map((item) => {
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
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
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
          <span>Showing {filteredCategories.length} of {categories.length} sectors registered</span>
          <span>NPO-CAT-V2.5 REV: 2025.02</span>
        </div>
      </div>
    </div>
  );
}