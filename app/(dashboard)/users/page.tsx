"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  UserX,
  Building2,
  TrendingUp,
  Download,
  Logs,
  ShieldAlert,
  Layers,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddUserModal } from "./_components/AddUserModal";
import { UsersTable, UserItem } from "./_components/UsersTable";

interface StatCard {
  title: string;
  value: string;
  badge: string;
  badgeType: "growth" | "percentage" | "alert" | "info";
  description: string;
  icon: React.ElementType;
  progress: number;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeTextColor: string;
  progressColor: string;
}

const STATS_DATA: StatCard[] = [
  {
    title: "TOTAL USERS",
    value: "12,480",
    badge: "+8.4%",
    badgeType: "growth",
    description: "+960 this month across all nodes",
    icon: Users,
    progress: 70,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/60",
    badgeTextColor: "text-emerald-700 dark:text-emerald-400",
    progressColor: "bg-indigo-600 dark:bg-indigo-500",
  },
  {
    title: "ACTIVE USERS",
    value: "11,850",
    badge: "94.9%",
    badgeType: "percentage",
    description: "Consistent daily platform engagements",
    icon: CheckCircle2,
    progress: 95,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/60",
    badgeTextColor: "text-emerald-700 dark:text-emerald-400",
    progressColor: "bg-emerald-600 dark:bg-emerald-500",
  },
  {
    title: "DEACTIVATED USERS",
    value: "630",
    badge: "5.1%",
    badgeType: "alert",
    description: "Requires compliance review & purge",
    icon: UserX,
    progress: 25,
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconColor: "text-red-500 dark:text-red-400",
    badgeBg: "bg-red-100 dark:bg-red-950/60",
    badgeTextColor: "text-red-600 dark:text-red-400",
    progressColor: "bg-red-600 dark:bg-red-500",
  },
  {
    title: "MERCHANT ADMINS",
    value: "1,420",
    badge: "Tenants",
    badgeType: "info",
    description: "Across all 412 active enterprise merchants",
    icon: Building2,
    progress: 80,
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-indigo-100 dark:bg-indigo-950/60",
    badgeTextColor: "text-indigo-600 dark:text-indigo-400",
    progressColor: "bg-indigo-600 dark:bg-indigo-500",
  },
];

const AVAILABLE_MERCHANTS = [
  "Netsa Tech",
  "Addis Retail",
  "Ethio Telecom",
  "Zemen Express",
];

const AVAILABLE_ROLES = [
  "Super Admin",
  "Merchant Manager",
  "Auditor & Support",
  "Compliance Officer",
];

const INITIAL_USERS: UserItem[] = [
  {
    id: "usr-1",
    firstName: "Abebe",
    lastName: "Bikila",
    phone: "+251 911 123 456",
    merchant: "Netsa Tech",
    role: "Super Admin",
    status: "Active",
    lastActive: "2 mins ago",
    createdAt: "2026-01-15",
  },
  {
    id: "usr-2",
    firstName: "Tigist",
    lastName: "Assefa",
    phone: "+251 912 987 654",
    merchant: "Addis Retail",
    role: "Merchant Manager",
    status: "Active",
    lastActive: "15 mins ago",
    createdAt: "2026-02-01",
  },
  {
    id: "usr-3",
    firstName: "Yared",
    lastName: "Getachew",
    phone: "+251 913 555 777",
    merchant: "Ethio Telecom",
    role: "Auditor & Support",
    status: "Active",
    lastActive: "1 hour ago",
    createdAt: "2026-03-10",
  },
  {
    id: "usr-4",
    firstName: "Bethlehem",
    lastName: "Tadesse",
    phone: "+251 914 444 888",
    merchant: "Zemen Express",
    role: "Merchant Manager",
    status: "Inactive",
    lastActive: "3 days ago",
    createdAt: "2026-04-22",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchantFilter, setSelectedMerchantFilter] = useState("All");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Toggle user active status
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "Active" ? "Inactive" : "Active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Change user role
  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  // Add new user
  const handleAddUser = (newUser: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  }) => {
    const created: UserItem = {
      id: `usr-${Date.now()}`,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      merchant: "Netsa Tech",
      role: newUser.role,
      status: "Active",
      lastActive: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [created, ...prev]);
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.merchant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMerchant =
      selectedMerchantFilter === "All" || u.merchant === selectedMerchantFilter;

    const matchesRole =
      selectedRoleFilter === "All" || u.role === selectedRoleFilter;

    const matchesStatus =
      selectedStatusFilter === "All" || u.status === selectedStatusFilter;

    return matchesSearch && matchesMerchant && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            User Management
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage admin portal users, view activity details, update status, and assign roles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="gap-2 shadow-xs bg-white text-black hover:bg-neutral-100 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border border-neutral-200"
          >
            <Logs className="h-4 w-4" />
            <span>Audit Logs</span>
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New User</span>
          </Button>
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_DATA.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {card.title}
                  </span>
                  <div className={`rounded-xl p-2.5 ${card.iconBg}`}>
                    <IconComponent className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    {card.value}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold ${card.badgeBg} ${card.badgeTextColor}`}
                  >
                    {card.badgeType === "growth" && (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {card.badge}
                  </span>
                </div>

                <p
                  className={`mt-2 text-xs font-medium leading-relaxed ${
                    card.badgeType === "alert"
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {card.description}
                </p>
              </div>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.progressColor}`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & Actions Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
        {/* All controls in one single horizontal row */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="flex gap-2">
            <div className="relative min-w-65 flex-1 sm:flex-none">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, phone, email, or me"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-indigo-50/60 dark:bg-slate-800/60 py-2 pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            {/* Merchants Filter */}
            <select
              value={selectedMerchantFilter}
              onChange={(e) => setSelectedMerchantFilter(e.target.value)}
              className="rounded-xl border border-transparent bg-indigo-50/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
            >
              <option value="All">All Merchants</option>
              {AVAILABLE_MERCHANTS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Roles Filter */}
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="rounded-xl border border-transparent bg-indigo-50/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
            >
              <option value="All">All Roles</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Statuses Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="rounded-xl border border-transparent bg-indigo-50/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Export CSV Button inline */}
            <button
              type="button"
              onClick={() => console.log("Export CSV")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-bold text-foreground hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs">Sync Real-time</span>
          </div>
        </div>
      </div>

      {/* Users Table Component */}
      <UsersTable
        users={filteredUsers}
        availableRoles={AVAILABLE_ROLES}
        onToggleStatus={handleToggleStatus}
        onRoleChange={handleRoleChange}
      />

      {/* Security Pulse, Role Dispersal & Federation Status Footer */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 pt-2">
        {/* Security Pulse Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-foreground">Security Pulse</h3>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Optimal
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Multi-factor authentication enabled on 98.2% of tenant manager credentials.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-8 text-xs font-mono">
            <div>
              <span className="block text-muted-foreground text-[11px]">Failed logins (24h):</span>
              <span className="font-bold text-foreground">4</span>
            </div>
            <div>
              <span className="block text-muted-foreground text-[11px]">Session invalidations:</span>
              <span className="font-bold text-foreground">12</span>
            </div>
          </div>
        </div>

        {/* Role Dispersal Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-foreground">Role Dispersal</h3>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">5 Levels</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-foreground">Cashiers & Sales</span>
                  <span className="font-mono text-muted-foreground">7,812 (62%)</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[62%] rounded-full bg-indigo-600 dark:bg-indigo-500" />
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-foreground">Inventory & Admins</span>
                  <span className="font-mono text-muted-foreground">4,668 (38%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Federation Status Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-foreground">Federation Status</h3>
              </div>
              <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                All Synced
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Directory synchronization with Fayda Digital ID & Tenant LDAP relays is active.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <div>
              Latency: <span className="font-bold text-foreground">42ms</span>
            </div>
            <div>
              Last sync: <span className="font-bold text-foreground">20s ago</span>
            </div>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
        availableRoles={AVAILABLE_ROLES}
      />
    </div>
  );
}