"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  AlertCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { TransactionItem, PaymentMethod } from "../types";

interface TransactionTableProps {
  transactions: TransactionItem[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination Logic
  const totalItems = 48290; // Matching screenshot ledger total
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(transactions.map((t) => t.id));
      setSelectAll(true);
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const renderPaymentBadge = (method: PaymentMethod) => {
    switch (method) {
      case "Cash":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Wallet className="h-3.5 w-3.5 text-slate-500" /> Cash
          </span>
        );
      case "Telebirr":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-300">
            <Smartphone className="h-3.5 w-3.5 text-purple-600" /> Telebirr
          </span>
        );
      case "Card (Visa)":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300">
            <CreditCard className="h-3.5 w-3.5 text-blue-600" /> Card (Visa)
          </span>
        );
      case "Bank Transfer":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            <Building2 className="h-3.5 w-3.5 text-indigo-600" /> Bank Transfer
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Table Control Sub-Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded-md border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>Select All ({transactions.length.toLocaleString()})</span>
          </label>
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
            LIVE STREAM CONNECTED
          </span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" /> Updated: 3s ago
          </span>
          <span>
            Density: <strong className="text-foreground">Compact</strong>
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-indigo-50/40 dark:bg-slate-900/80 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-3 w-8 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3 px-4">INVOICE NUMBER</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">MERCHANT & TENANT ID</th>
                <th className="py-3 px-4">CUSTOMER INFO</th>
                <th className="py-3 px-4 text-right">SUBTOTAL & TAX</th>
                <th className="py-3 px-4 text-right">TOTAL AMOUNT</th>
                <th className="py-3 px-4 text-center">PAYMENT METHOD</th>
                <th className="py-3 px-4 text-right">FISCAL STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {transactions.map((tx) => {
                const isChecked = selectedIds.includes(tx.id);
                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors ${
                      isChecked
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRow(tx.id)}
                        className="h-4 w-4 rounded-md border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Invoice Number */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        {tx.invoiceNumber}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {tx.ejNumber}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-[11px] font-bold text-foreground whitespace-nowrap">
                      {tx.timestamp}
                    </td>

                    {/* Merchant & Tenant ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950 font-black text-[10px] text-indigo-700 dark:text-indigo-300 font-mono shrink-0">
                          {tx.merchantCode}
                        </span>
                        <div>
                          <p className="font-bold text-foreground text-xs">{tx.merchantName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{tx.tenantId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-foreground text-xs">{tx.customerName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{tx.customerPhone}</p>
                    </td>

                    {/* Subtotal & Tax */}
                    <td className="py-3 px-4 text-right font-mono text-[11px]">
                      <div>
                        <span className="text-muted-foreground text-[10px]">Base: </span>
                        <strong className="text-foreground">${tx.subtotal.toFixed(2)}</strong>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        (15%): ${tx.vatAmount.toFixed(2)}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm font-black text-foreground font-mono">
                        ${tx.totalAmount.toFixed(2)}
                      </div>
                      <div
                        className={`text-[9px] font-extrabold uppercase ${
                          tx.settlementStatus === "SYNC TIMEOUT"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {tx.settlementStatus}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 text-center">{renderPaymentBadge(tx.paymentMethod)}</td>

                    {/* Fiscal Status */}
                    <td className="py-3 px-4 text-right space-y-0.5">
                      {tx.fiscalStatus === "FISCALIZED / VERIFIED" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> FISCALIZED / VERIFIED
                        </span>
                      )}
                      {tx.fiscalStatus === "SYNCED" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-extrabold text-indigo-800 dark:text-indigo-300">
                          <ShieldCheck className="h-3 w-3" /> SYNCED
                        </span>
                      )}
                      {tx.fiscalStatus === "FAILED MOR SYN" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 text-[10px] font-extrabold text-rose-800 dark:text-rose-300">
                          <AlertCircle className="h-3 w-3" /> FAILED MOR SYN
                        </span>
                      )}
                      <div className="text-[10px] font-mono text-muted-foreground">{tx.hashOrAck}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-indigo-50/30 dark:bg-slate-900/50 border-t border-border/80 text-xs font-semibold text-muted-foreground">
          {/* Left Info & Select */}
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-foreground font-black">{startItem}-{endItem}</strong> of{" "}
              <strong className="text-foreground font-black">{totalItems.toLocaleString()}</strong> transactions
            </span>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-card border border-border rounded-lg px-2 py-1 text-xs font-bold text-foreground focus:outline-hidden cursor-pointer shadow-2xs"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Right Page Controls */}
          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Numbers */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 1
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 2
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 3
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              3
            </button>
            <span className="px-1 text-muted-foreground">...</span>
            <button
              onClick={() => setCurrentPage(4829)}
              className={`px-2 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 4829
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              4829
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}