"use client";

import { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Store,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Merchant, MerchantStatus } from "./types";
import { AddMerchantModal } from "./_components/AddMerchantModal";
import { MerchantDetailModal } from "./_components/MerchantDetailModal";

const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: "mch-1",
    name: "Sunrise Grocery Hub",
    category: "Retail & Supermarket",
    tinNumber: "0049281729",
    managerName: "Kaleb Worku",
    contactPhone: "+251 911 448 839",
    status: "APPROVED",
    licenseFile: "Trade_License_Sunrise_2025.pdf",
    managerIdFile: "Manager_ID_Kaleb.pdf",
    createdAt: "2026-01-10",
    outletsCount: 4,
  },
  {
    id: "mch-2",
    name: "Addis Pharmacy Chain",
    category: "Pharmacy & Healthcare",
    tinNumber: "0018273645",
    managerName: "Hiwot Tadesse",
    contactPhone: "+251 912 334 455",
    status: "COMPLETE",
    licenseFile: "Addis_Pharma_License.pdf",
    managerIdFile: "Manager_Hiwot_ID.pdf",
    createdAt: "2026-02-14",
    outletsCount: 2,
  },
  {
    id: "mch-3",
    name: "Ethio Express Logistics",
    category: "Logistics & Express",
    tinNumber: "0098765432",
    managerName: "Biniyam Alemu",
    contactPhone: "+251 913 778 899",
    status: "INCOMPLETE",
    licenseFile: "Trade_License_Draft.pdf",
    createdAt: "2026-03-01",
    outletsCount: 1,
  },
  {
    id: "mch-4",
    name: "Zemen Retail Stores",
    category: "Retail & Supermarket",
    tinNumber: "0033445566",
    managerName: "Abebe Bikila",
    contactPhone: "+251 911 223 344",
    status: "APPROVED",
    licenseFile: "Zemen_Retail_2026.pdf",
    managerIdFile: "Abebe_ID_Scan.pdf",
    createdAt: "2026-04-12",
    outletsCount: 8,
  },
];

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Status counters
  const totalCount = merchants.length;
  const approvedCount = merchants.filter((m) => m.status === "APPROVED").length;
  const completeCount = merchants.filter((m) => m.status === "COMPLETE").length;
  const incompleteCount = merchants.filter((m) => m.status === "INCOMPLETE").length;

  const handleAddMerchant = (newMerchant: Merchant) => {
    setMerchants((prev) => [newMerchant, ...prev]);
  };

  const handleUpdateMerchant = (updated: Merchant) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  const openDetail = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsDetailModalOpen(true);
  };

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tinNumber.includes(searchTerm) ||
      m.managerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "All" || m.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Merchant Management
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Enterprise Merchants & Tenants
          </h1>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            Oversee tenant registrations, TIN compliance, trade licenses, and settlement provisioning.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            className="gap-2 text-xs font-bold bg-background shadow-xs border-border"
          >
            <Download className="h-4 w-4" />
            <span>Export Merchant Registry</span>
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Merchant</span>
          </Button>
        </div>
      </div>

      {/* Metric Status Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Merchants */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Total Merchants
            </span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-2.5 text-indigo-600 dark:text-indigo-400">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">{totalCount}</span>
            <span className="text-xs font-semibold text-muted-foreground">Registered Tenants</span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Active clearing hub routing
          </p>
        </div>

        {/* Approved Status Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Approved Status
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-2.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">{approvedCount}</span>
            <span className="text-xs font-semibold text-muted-foreground">Cleared & Live</span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-muted-foreground">
            Full transaction functionality
          </p>
        </div>

        {/* Complete Status Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Complete Profile
            </span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 p-2.5 text-blue-600 dark:text-blue-400">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">{completeCount}</span>
            <span className="text-xs font-semibold text-muted-foreground">Pending Final Approval</span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            Docs submitted & verified
          </p>
        </div>

        {/* Incomplete Profile Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Incomplete Profile
            </span>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 p-2.5 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">{incompleteCount}</span>
            <span className="text-xs font-semibold text-muted-foreground">Missing KYC / License</span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Requires document upload
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-64 flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search merchant name, TIN, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-indigo-50/50 dark:bg-slate-800/60 py-2 pl-10 pr-4 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="rounded-xl border border-transparent bg-indigo-50/50 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-foreground cursor-pointer focus:border-indigo-500 focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETE">Complete Profile</option>
              <option value="INCOMPLETE">Incomplete Profile</option>
            </select>
          </div>

          <span className="text-xs font-mono font-medium text-muted-foreground">
            Showing <strong className="text-foreground">{filteredMerchants.length}</strong> of {merchants.length} Merchants
          </span>
        </div>
      </div>

      {/* Merchants Table */}
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
              {filteredMerchants.map((merchant) => (
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
                    {merchant.category}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {merchant.tinNumber}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <div>{merchant.managerName}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {merchant.contactPhone}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
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
                      onClick={() => openDetail(merchant)}
                      className="gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                    >
                      <span>View & Edit</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddMerchantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMerchant={handleAddMerchant}
      />

      <MerchantDetailModal
        isOpen={isDetailModalOpen}
        merchant={selectedMerchant}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateMerchant={handleUpdateMerchant}
      />
    </div>
  );
}