"use client";

import React from "react";
import { Search, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedMerchant: string;
  setSelectedMerchant: (val: string) => void;
  selectedMethod: string;
  setSelectedMethod: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  onReset: () => void;
}

export function TransactionFilters({
  searchTerm,
  setSearchTerm,
  selectedMerchant,
  setSelectedMerchant,
  selectedMethod,
  setSelectedMethod,
  selectedStatus,
  setSelectedStatus,
  onReset,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Invoice #, Merchant, Customer..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
          <select
            value={selectedMerchant}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMerchant(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Merchants (142)</option>
            <option value="Central Cafe">Central Cafe</option>
            <option value="Acme Supermarket">Acme Supermarket</option>
            <option value="Metro Pharmacy">Metro Pharmacy</option>
            <option value="Velocity Motors">Velocity Motors</option>
          </select>

          <select
            value={selectedMethod}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMethod(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Telebirr">Telebirr</option>
            <option value="Card (Visa)">Card (Visa)</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Completed Status</option>
            <option value="FISCALIZED / VERIFIED">Fiscalized</option>
            <option value="SYNCED">Synced</option>
          </select>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          className="gap-1.5 text-xs font-bold rounded-xl cursor-pointer shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Active Filter Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-extrabold text-[10px] uppercase tracking-wider text-muted-foreground">ACTIVE:</span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
          Date: Last 30 Days
          <X className="h-3 w-3 cursor-pointer hover:opacity-80" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
          Status: Completed
          <X className="h-3 w-3 cursor-pointer hover:opacity-80" />
        </span>
        <button
          onClick={onReset}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}