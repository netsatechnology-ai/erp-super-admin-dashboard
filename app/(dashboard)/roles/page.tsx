"use client";

import { useState } from "react";
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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleDetailModal, Role } from "./_components/RoleDetailModal";
import { AddRoleModal } from "./_components/AddRoleModal";
import { RolesGrid } from "./_components/RolesGrid";

const INITIAL_ROLES: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    description:
      "Full platform access and management capabilities across all organizations.",
    userCount: 3,
    permissions: [
      "dashboard:system:view",
      "dashboard:merchant:view",
      "transaction:read",
      "transaction:refund",
      "transaction:export",
      "invoice:create",
      "invoice:read",
      "invoice:update",
      "invoice:cancel",
      "invoice:print",
      "inventory:item:create",
      "inventory:item:read",
      "inventory:item:update",
      "inventory:item:delete",
      "stock:level:read",
      "stock:adjust",
      "stock:transfer",
      "stock:supplier:manage",
      "system:superadmin",
      "system:audit_logs:read",
      "user:create",
      "user:read",
      "user:update",
      "user:delete",
      "user:status:change",
      "merchant:create",
      "merchant:read",
      "merchant:update",
      "merchant:delete",
      "merchant:status:change",
      "merchant_category:create",
      "merchant_category:read",
      "merchant_category:update",
      "merchant_category:delete",
      "role:create",
      "role:read",
      "role:update",
      "role:delete",
      "user_role:assign",
      "user_role:revoke",
      "user_role:read",
    ],
    isSystem: true,
    status: "ACTIVE",
  },
  {
    id: "r2",
    name: "Merchant Manager",
    description:
      "Oversees merchant onboarding, verification, and settlement records.",
    userCount: 14,
    permissions: [
      "merchant:create",
      "merchant:read",
      "merchant:update",
      "merchant:status:change",
      "merchant_category:read",
      "transaction:read",
      "invoice:read",
    ],
    status: "ACTIVE",
  },
  {
    id: "r3",
    name: "Auditor & Support",
    description:
      "Read-only access for compliance inspection and system activity log tracking.",
    userCount: 8,
    permissions: [
      "system:audit_logs:read",
      "transaction:read",
      "transaction:export",
      "invoice:read",
      "merchant:read",
      "user:read",
    ],
    status: "DEACTIVATED",
  },
];

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScope, setSelectedScope] = useState("All Scopes");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetail = (role: Role) => {
    setSelectedRole(role);
    setIsDetailModalOpen(true);
  };

  const handleSaveRole = (updatedRole: Role) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
    );
  };

  const handleAddRole = (newRole: Role) => {
    setRoles((prev) => [newRole, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Governance & Security
          </span>
          <span className="text-xs font-mono font-medium text-muted-foreground">
            SYS.RBAC.v4
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
              className="gap-2 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border-indigo-200/60 dark:border-indigo-800/40 shadow-xs text-xs font-bold"
            >
              <Download className="h-4 w-4" />
              <span>Audit Matrix</span>
            </Button>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-xs text-xs font-bold"
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
            <span className="text-3xl font-black tracking-tight text-foreground">8</span>
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
            <span className="text-3xl font-black tracking-tight text-foreground">7</span>
            <span className="text-xs font-semibold text-muted-foreground">Active Roles</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[87.5%] rounded-full bg-emerald-600 dark:bg-emerald-500" />
            </div>
            <span className="text-xs font-bold text-muted-foreground shrink-0">87.5%</span>
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
            <span className="text-3xl font-black tracking-tight text-foreground">1</span>
            <span className="text-xs font-semibold text-muted-foreground">Deactivated</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Junior Cashier (Trainee)</span>
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
            <span className="text-3xl font-black tracking-tight text-foreground">12,480</span>
            <span className="text-xs font-semibold text-muted-foreground">Users</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+312 assigned this billing cycle</span>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All Scopes">All Scopes</option>
            <option value="Platform">Platform Scope</option>
            <option value="Merchant">Merchant Scope</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="ml-auto text-xs font-mono font-medium text-muted-foreground">
            &gt; Showing <span className="font-bold text-foreground">{filteredRoles.length}</span> of{" "}
            <span className="font-bold text-foreground">8 Roles</span>
          </div>
        </div>
      </div>

      {/* Dedicated RolesGrid Component */}
      <RolesGrid roles={filteredRoles} onOpenDetail={handleOpenDetail} />

      {/* Modals */}
      <RoleDetailModal
        isOpen={isDetailModalOpen}
        role={selectedRole}
        onClose={() => setIsDetailModalOpen(false)}
        onSaveRole={handleSaveRole}
      />

      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRole={handleAddRole}
      />
    </div>
  );
}