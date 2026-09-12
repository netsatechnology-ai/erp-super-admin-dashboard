"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  ShieldCheck, 
  Plus, 
  Users, 
  Search, 
  CheckCircle2,
  Download,
  Zap,
  LockKeyhole,
  TrendingUp,
  Info,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleDetailModal, Role } from "./_components/RoleDetailModal";
import { AddRoleModal } from "./_components/AddRoleModal";
import { RolesGrid } from "./_components/RolesGrid";
import { RoleService } from "@/services/RoleService";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { useAppDispatch } from "@/lib/redux/store";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({
    search: "",
    scope: "All Scopes",
    status: "All Statuses",
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await RoleService.fetchPermissions();
      if (response?.status || response?.data) {
        const data = response?.data || response;
        setPermissions(Array.isArray(data) ? data : data?.permissions || []);
      }
    } catch (error: any) {
      dispatch(
        showResponseModal({
          status: "error",
          message: error?.message || "Failed to fetch system permissions",
          buttonText: "Close",
        })
      );
    }
  }, [dispatch]);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await RoleService.fetchRoles(filter);
      if (response?.status || response?.data) {
        const data = response?.data || response;
        setRoles(Array.isArray(data) ? data : data?.roles || []);
        
        if (filter.currentPage === 1) {
          setFilter((prev) => ({
            ...prev,
            totalPages: response?.pagination?.totalPages  || 1,
            totalItems: response?.pagination?.totalItems  || 1,
          }));
        }
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            message: "Failed to get role list",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(
        showResponseModal({
          status: "error",
          message: error?.message || "Failed to get role list",
          buttonText: "Try Again",
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [filter.search, filter.currentPage, dispatch]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  useEffect(() => {
    fetchRoles();
  }, [filter.currentPage]);

  const handleFilterChange = (newFilters: Partial<typeof filter>) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 whenever search query, scope, or status changes
      ...(newFilters.currentPage === undefined && { currentPage: 1 }),
    }));
  };

  const handleOpenDetail = (role: Role) => {
    setSelectedRole(role);
    setIsDetailModalOpen(true);
  };

  const handleSaveRole = () => {
    fetchRoles();
    setSelectedRole(null);
    setIsDetailModalOpen(false);
  };

  const handleAddRole = () => {
    fetchRoles();
    setIsAddModalOpen(false);
  };

  const activeRolesCount = roles?.filter(
    (r) => r.status === "ACTIVE" || r.status === "Active"
  ).length || 0;

  const deactivatedRolesCount = roles?.filter(
    (r) => r.status === "DEACTIVATED" || r.status === "Inactive"
  ).length || 0;

  const totalRolesCount = roles?.length || 0;
  const activePercentage =
    totalRolesCount > 0 ? Math.round((activeRolesCount / totalRolesCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Governance & Security
          </span>
         
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Roles & Access Control
            </h1>
            <p className="mt-1 text-xs font-medium text-muted-foreground max-w-2xl">
              Manage system roles, assign granular permissions, and control authorization lifecycle across platforms.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => console.log("Audit Matrix clicked")}
              className="gap-2 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border-indigo-200/60 dark:border-indigo-800/40 shadow-xs text-xs font-bold cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Audit Matrix</span>
            </Button>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-xs text-xs font-bold cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Role</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Total Configured
            </span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">
              {totalRolesCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Defined Roles</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% policy compliance</span>
          </div>
        </div>

        <div className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Live Roles
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-2 text-emerald-600 dark:text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">
              {activeRolesCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Active Roles</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                style={{ width: `${activePercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground shrink-0">
              {activePercentage}%
            </span>
          </div>
        </div>

        <div className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Suspended / Draft
            </span>
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 p-2 text-rose-500 dark:text-rose-400">
              <LockKeyhole className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">
              {deactivatedRolesCount}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Deactivated</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Pending audit or lifecycle hold</span>
          </div>
        </div>

        <div className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Identity Coverage
            </span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground">
              {roles?.reduce((acc, curr) => acc + (curr.userCount || 0), 0) || 0}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Assigned Users</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active across all system roles</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-70">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roles by title, keyword, or action..."
              value={filter.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          <select
            value={filter.scope}
            onChange={(e) => handleFilterChange({ scope: e.target.value })}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All Scopes">All Scopes</option>
            <option value="Platform">Platform Scope</option>
            <option value="Merchant">Merchant Scope</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <div className="ml-auto text-xs font-mono font-medium text-muted-foreground">
            &gt; Page <span className="font-bold text-foreground">{filter.currentPage}</span> of{" "}
            <span className="font-bold text-foreground">{filter.totalPages || 1}</span>
          </div>
        </div>
      </div>

      {/* Roles Grid Display */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">Loading system roles...</span>
        </div>
      ) : (
        <RolesGrid roles={roles || []} onOpenDetail={handleOpenDetail} filter={filter} setFilter={setFilter}  />
      )}

      {/* Modals */}
      <RoleDetailModal
        isOpen={isDetailModalOpen}
        role={selectedRole}
        permissions={permissions}
        onClose={() => setIsDetailModalOpen(false)}
        onSaveRole={handleSaveRole}
      />

      <AddRoleModal
        isOpen={isAddModalOpen}
        permissions={permissions}
        onClose={() => setIsAddModalOpen(false)}
        onAddRole={handleAddRole}
      />
    </div>
  );
}