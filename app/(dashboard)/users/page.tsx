"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Power,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddUserModal } from "./_components/AddUserModal";


export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

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
    email: "abebe.b@netsatech.com",
    phone: "+251 911 123 456",
    role: "Super Admin",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "usr-2",
    firstName: "Tigist",
    lastName: "Assefa",
    email: "tigist.a@netsatech.com",
    phone: "+251 912 987 654",
    role: "Merchant Manager",
    status: "Active",
    createdAt: "2026-02-01",
  },
  {
    id: "usr-3",
    firstName: "Yared",
    lastName: "Getachew",
    email: "yared.g@netsatech.com",
    phone: "+251 913 555 777",
    role: "Auditor & Support",
    status: "Active",
    createdAt: "2026-03-10",
  },
  {
    id: "usr-4",
    firstName: "Bethlehem",
    lastName: "Tadesse",
    email: "beth.t@netsatech.com",
    phone: "+251 914 444 888",
    role: "Merchant Manager",
    status: "Inactive",
    createdAt: "2026-04-22",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toggle user active status (Activate / Deactivate)
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
    setActiveMenuId(null);
  };

  // Change user role from dropdown
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
      ...newUser,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [created, ...prev]);
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    const matchesRole =
      selectedRoleFilter === "All" || u.role === selectedRoleFilter;

    const matchesStatus =
      selectedStatusFilter === "All" || u.status === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
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
            Manage admin portal users, view contact details, update status, and assign roles.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-xs">
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <CustomInput
            placeholder="Search by name, email, or phone..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Roles</option>
            {AVAILABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  User Profile
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Email Address
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Role Assigned
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-xs text-muted-foreground"
                  >
                    No users match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initials =
                    `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                  const isMenuOpen = activeMenuId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-semibold text-foreground leading-tight block">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Added {user.createdAt}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 text-primary" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          <span>{user.phone || "N/A"}</span>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent focus:outline-hidden focus:ring-2 focus:ring-ring cursor-pointer"
                          >
                            {AVAILABLE_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {user.status === "Active" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions Menu */}
                      <td className="relative px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(isMenuOpen ? null : user.id)
                          }
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-6 top-12 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user.id)}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                user.status === "Active"
                                  ? "text-amber-600 hover:bg-amber-500/10"
                                  : "text-emerald-600 hover:bg-emerald-500/10"
                              }`}
                            >
                              <Power className="h-3.5 w-3.5" />
                              <span>
                                {user.status === "Active"
                                  ? "Deactivate User"
                                  : "Activate User"}
                              </span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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