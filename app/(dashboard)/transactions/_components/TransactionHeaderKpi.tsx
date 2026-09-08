"use client";

import React from "react";
import {
  Calendar,
  Columns,
  Download,
  TrendingUp,
  Receipt,
  Landmark,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function TransactionHeaderKpi() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
              FISCAL TELEMETRY HUB
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sync Rate: <strong className="text-foreground font-bold">99.98%</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground mt-1">
            Transaction & Invoice Ledger
          </h1>
          <p className="text-xs text-muted-foreground">
            Live multi-tenant invoice stream, settlement reconciliation, and tax records
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold rounded-xl cursor-pointer">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>REPORTING WINDOW:</span>
            <strong className="text-indigo-600 dark:text-indigo-400">Last 30 Days</strong>
          </Button>

          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold rounded-xl cursor-pointer">
            <Columns className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Columns (9)</span>
          </Button>

          <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer">
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Gross Transaction Volume
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">$1,842,910.50</div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="h-3 w-3" /> +14.2% vs last month
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Processed Invoices
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">48,290</div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span><strong>99.4%</strong> fiscal automated</span>
            <span className="h-1.5 w-16 rounded-full bg-purple-600 overflow-hidden" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Total Tax Collected
              </span>
              <span className="text-[9px] font-bold text-muted-foreground">(VAT 15%)</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">$240,379.60</div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>✓ MoR Fiscal Gateway E-TAX Synced</span>
            <span className="text-muted-foreground text-[9px] font-mono">V3.1</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Average Ticket Value
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Ticket className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">$38.16</div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Peak velocity: <strong className="text-foreground">13:00 - 15:30</strong></span>
            <span className="rounded bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.5 font-bold text-blue-700 dark:text-blue-300 text-[9px]">+3.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}