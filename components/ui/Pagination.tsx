"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface FilterState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  [key: string]: any;
}

export interface PaginationProps {
  filter: FilterState;
  setFilter: Dispatch<SetStateAction<any>>;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  filter,
  setFilter,
  pageSizeOptions = [5, 10, 20, 50],
  className = "",
}: PaginationProps) {
  const { currentPage = filter.currentPage, pageSize = filter.pageSize, totalPages = filter.totalPages, totalItems=filter.totalItems } = filter;

  const startItem = totalPages === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems<=pageSize?totalItems:(currentPage  * pageSize)>totalItems?totalItems:currentPage  * pageSize ;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilter((prev: any) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setFilter((prev: any) => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
  };

  // Generate page numbers with ellipses
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." &&
        (i < currentPage - delta || i > currentPage + delta)
      ) {
        pages.push("...");
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1 text-xs text-muted-foreground ${className}`}
    >
      {/* Items Counter & Rows Per Page */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium">
          Showing <span className="font-bold text-foreground">{startItem}</span>{" "}
          to <span className="font-bold text-foreground">{endItem}</span>
          {totalPages > 0 && (
            <>
              {" "}
              of{" "}
              <span className="font-bold text-foreground">
                {totalItems || ""}
              </span>{" "}
              results
            </>
          )}
        </p>

        <div className="flex items-center gap-1.5 border-l border-border pl-3">
          <span className="text-[11px] font-medium">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="bg-transparent border border-border rounded-lg px-2 py-1 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {pageSizeOptions.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-card text-foreground"
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Go to first page"
          className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
          className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page List */}
        <div className="flex items-center gap-1 px-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-muted-foreground/60 select-none"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;

            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => handlePageChange(Number(p))}
                aria-current={isCurrent ? "page" : undefined}
                className={`min-w-[32px] h-8 px-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
          className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Go to last page"
          className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;