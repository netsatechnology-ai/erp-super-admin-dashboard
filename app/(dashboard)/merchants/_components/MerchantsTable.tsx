"use client";

import { 
  Store, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Merchant } from "../types";
import Pagination from "@/components/ui/Pagination";

interface MerchantsTableProps {
  merchants: Merchant[];
  filter:any,
  setFilter:any,

  loading: boolean;
  onSelectMerchant: (merchant: Merchant) => void;
}

export function MerchantsTable({
  merchants,
  filter,
  setFilter,
  loading,
  onSelectMerchant,
}: MerchantsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/40 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3.5 px-4">Merchant Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">TIN Number</th>
              <th className="py-3.5 px-4">Manager Name</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span>Loading merchants...</span>
                  </div>
                </td>
              </tr>
            ) : merchants.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground font-medium">
                  No merchants found matching your criteria.
                </td>
              </tr>
            ) : (
              merchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
                        <Store className="h-4 w-4" />
                      </div>
                      <div>
                        <span>{merchant.name}</span>
                        <span className="block text-[10px] font-normal text-muted-foreground">
                          {merchant.outletsCount || 1} Outlets Registered
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-muted-foreground">
                    {merchant.categoryId}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {merchant.tin}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <div>{merchant.managerFullName}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {merchant.managerPhoneNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {merchant.status}
                  </td>
                    {merchant.status === "APPROVED" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        APPROVED
                      </span>
                    )}
                    {merchant.status === "COMPLETE" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                        <Clock className="h-3 w-3" />
                        COMPLETE
                      </span>
                    )}
                    {merchant.status === "INCOMPLETE" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        INCOMPLETE
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectMerchant(merchant)}
                      className="gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                    >
                      <span>View & Edit</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
       <div className="p-3 border-t border-border/80">
                
                <Pagination 
                filter={filter}
                setFilter={setFilter}
      
                
                />
              </div>
    </div>
  );
}