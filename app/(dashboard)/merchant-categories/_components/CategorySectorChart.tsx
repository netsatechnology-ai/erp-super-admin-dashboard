"use client";

import React from "react";
import { PieChart as PieChartIcon } from "lucide-react";

export function CategorySectorChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          TOP MERCHANT SECTORS
        </h3>
        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-2.5 pt-1">
        <div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Retail (RTL)</span>
            <span className="text-indigo-600 dark:text-indigo-400">38%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: "38%" }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Food & Beverage (FNB)</span>
            <span className="text-indigo-600 dark:text-indigo-400">33%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: "33%" }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Healthcare (HLT)</span>
            <span className="text-indigo-600 dark:text-indigo-400">11%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: "11%" }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Others (AUT, HSP, DGI)</span>
            <span className="text-indigo-600 dark:text-indigo-400">18%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: "18%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}