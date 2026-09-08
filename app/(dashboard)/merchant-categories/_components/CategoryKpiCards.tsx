"use client";

import React from "react";
import { TrendingUp, FolderTree, Building2, PieChart as PieChartIcon, Archive } from "lucide-react";

export function CategoryKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Categories */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              TOTAL CATEGORIES
            </p>
            <h3 className="text-xl font-black text-foreground mt-1">16 Active Sectors</h3>
          </div>
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
            <FolderTree className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+2 added this quarter</span>
        </div>
      </div>

      {/* Linked Merchants */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              LINKED MERCHANTS
            </p>
            <h3 className="text-xl font-black text-foreground mt-1">428 Businesses</h3>
          </div>
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+14.8% YoY growth</span>
        </div>
      </div>

      {/* Top Category */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              TOP CATEGORY
            </p>
            <h3 className="text-sm font-extrabold text-foreground mt-1">Retail & Supermarket</h3>
            <p className="text-[11px] font-medium text-muted-foreground">164 merchants (38.3% share)</p>
          </div>
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
            <PieChartIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Deactivated Categories */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              DEACTIVATED CATEGORIES
            </p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl font-black text-foreground">2 Inactive</h3>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                Archived
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Scheduled for purge review</p>
          </div>
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2 text-slate-500">
            <Archive className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}