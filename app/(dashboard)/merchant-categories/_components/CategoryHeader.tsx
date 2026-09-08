"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  onAddClick: () => void;
}

export function CategoryHeader({ onAddClick }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Merchant Categories
          </h1>
          <span className="rounded-md bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
            CATALOG CONFIG
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">
          Classify merchant business sectors, compliance requirements, and category-level default tax policies
        </p>
      </div>

      <Button
        onClick={onAddClick}
        className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs shrink-0 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Add Category</span>
      </Button>
    </div>
  );
}