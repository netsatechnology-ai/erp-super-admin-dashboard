"use client";

import React from "react";
import { ShieldCheck, RefreshCw, ClipboardCheck } from "lucide-react";

export function TransactionBottomCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {/* Card 1: Fiscal Key Rotation */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-extrabold text-foreground truncate">
            Fiscal Key Rotation
          </h4>
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            RSA-4096 signature active • Next syn...
          </p>
        </div>
      </div>

      {/* Card 2: MoR Terminal Replication */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
          <RefreshCw className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-extrabold text-foreground truncate">
            MoR Terminal Replication
          </h4>
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            141/142 tenants currently synchronized
          </p>
        </div>
      </div>

      {/* Card 3: Automated Reconciliation */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-extrabold text-foreground truncate">
            Automated Reconciliation
          </h4>
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            Daily ledger close at 23:59:59 UTC
          </p>
        </div>
      </div>
    </div>
  );
}