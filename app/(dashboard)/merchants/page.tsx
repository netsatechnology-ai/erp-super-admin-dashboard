"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  AlertTriangle,
  Download,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Merchant } from "./types";
import { AddMerchantModal } from "./_components/AddMerchantModal";
import { MerchantDetailModal } from "./_components/MerchantDetailModal";
import { MerchantsTable } from "./_components/MerchantsTable";
import { MerchantService } from "@/services/MerchantService";
import { SearchInput } from "@/components/ui/SearchInput";
import { useAppDispatch } from "@/lib/redux/store";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";

export default function MerchantsPage() {
  const dispatch = useAppDispatch();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [filter, setFilter] = useState({
    search: "",
    currentPage: 1,
    pageSize: 5,
    status: "",
    totalPages: 0,
    totalItems: 0,
  });

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await MerchantService.fetchMerchants(filter);
      setLoading(false);

      if (response?.data) {
      setLoading(false);

        setMerchants(response.data);
        if (filter.currentPage === 1) {
          setFilter((prev) => ({
            ...prev,
            totalPages: response.pagination?.totalPages || 0,
            totalItems: response?.pagination?.totalItems  || 1,
          }));
        }
      } else if (Array.isArray(response)) {
        setMerchants(response);
      }
    } catch (error) {
      console.error("Failed to fetch merchants:", error);
    } 
  };

  useEffect(() => {
    fetchMerchants();
  }, [filter.currentPage, filter.search]);

  const totalCount = merchants.length;
  const approvedCount = merchants.filter((m) => m.status === "APPROVED").length;
  const completeCount = merchants.filter((m) => m.status === "COMPLETE").length;
  const incompleteCount = merchants.filter(
    (m) => m.status === "INCOMPLETE"
  ).length;

  const handleAddMerchant = (newMerchant: Merchant) => {
    setMerchants((prev) => [newMerchant, ...prev]);
  };

  const handleUpdateMerchant = async (updated: Merchant) => {
    const previousMerchants = [...merchants];

    // Optimistic state update
    setMerchants((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );

    try {
      const response:any = await MerchantService.updateMerchant(updated, updated.id);
      if (response?.merchant) {
        dispatch(
          showResponseModal({
            status: "success", 
            message: "Merchant details updated successfully.",
            buttonText: "Done",
          })
        );
        fetchMerchants();
      } else {
        throw new Error(response?.message || "Failed to update merchant");
      }
    } catch (error: any) {
      setMerchants(previousMerchants);
      dispatch(
        showResponseModal({
          status: "error",
          message: error.message || "Failed to save merchant changes",
          buttonText: "Try Again",
        })
      );
    }
  };



  const handleDeleteMerchant = async (merchantId: string) => {
    const previousMerchants = [...merchants];

    setMerchants((prev) => prev.filter((m) => m.id !== merchantId));
    setIsDetailModalOpen(false);

    try {
      await MerchantService.deleteMerchant(merchantId);
      dispatch(
        showResponseModal({
          status: "success",
          message: "Merchant deleted successfully.",
          buttonText: "Done",
        })
      );
      fetchMerchants();
    } catch (error: any) {
      setMerchants(previousMerchants);
      dispatch(
        showResponseModal({
          status: "error",
          message: error.message || "Failed to delete merchant.",
          buttonText: "Try Again",
        })
      );
    }
  };

  const openDetail = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsDetailModalOpen(true);
  };

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
            Oversee tenant registrations, TIN compliance, trade licenses, and
            settlement provisioning.
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
            <span className="text-3xl font-black tracking-tight text-foreground">
              {totalCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Registered Tenants
            </span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Active clearing hub routing
          </p>
        </div>

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
            <span className="text-3xl font-black tracking-tight text-foreground">
              {approvedCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Cleared & Live
            </span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-muted-foreground">
            Full transaction functionality
          </p>
        </div>

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
            <span className="text-3xl font-black tracking-tight text-foreground">
              {completeCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Pending Final Approval
            </span>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            Docs submitted & verified
          </p>
        </div>

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
            <span className="text-3xl font-black tracking-tight text-foreground">
              {incompleteCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Missing KYC / License
            </span>
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
            <SearchInput
              value={filter.search}
              onChange={(val) => setFilter({ ...filter, search: val })}
              placeholder="Search merchant name, TIN, or manager..."
            />

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
        </div>
      </div>

      {/* Merchants Table Component */}
      <MerchantsTable
        merchants={merchants}
        loading={loading}
        onSelectMerchant={openDetail}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Modals */}
      <AddMerchantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMerchant={handleAddMerchant}
      />

      {selectedMerchant && (
        <MerchantDetailModal
          isOpen={isDetailModalOpen}
          merchant={selectedMerchant}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateMerchant={handleUpdateMerchant}
          onDeleteMerchant={(merchant:any) => handleDeleteMerchant(merchant.id)}
        />
      )}
    </div>
  );
}