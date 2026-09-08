"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export function RegulatoryBanner() {
  return (
    <div className="rounded-2xl border border-indigo-200/60 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 p-4 flex gap-3 items-start">
      <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
      <div className="text-xs space-y-0.5">
        <p className="font-extrabold text-foreground">Regulatory Tax Cascade Rule</p>
        <p className="text-muted-foreground leading-relaxed">
          Default tax policies assigned to a category automatically propagate as baseline presets for new terminal activations under that sector, unless explicitly overridden by an enterprise merchant override SLA.
        </p>
      </div>
    </div>
  );
}