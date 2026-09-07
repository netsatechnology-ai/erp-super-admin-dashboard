"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Plus, 
  Users, 
  Lock, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2,
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { RoleDetailModal, Role } from "@/components/roles/_components/RoleDetailModal";
// import { AddRoleModal } from "@/components/roles/AddRoleModal";
import { RoleDetailModal,Role } from "./_components/RoleDetailModal";
import { AddRoleModal } from "./_components/AddRoleModal";

const INITIAL_ROLES: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full platform access and management capabilities across all organizations.",
    userCount: 3,
    permissions: ["Full Access", "User Management", "Roles & Permissions", "Merchant Approval", "System Configuration"],
    isSystem: true,
  },
  {
    id: "r2",
    name: "Merchant Manager",
    description: "Oversees merchant onboarding, verification, and settlement records.",
    userCount: 14,
    permissions: ["View Merchants", "Edit Merchants", "Approve Outlets", "View Receipts"],
  },
  {
    id: "r3",
    name: "Auditor & Support",
    description: "Read-only access for compliance inspection and system activity log tracking.",
    userCount: 8,
    permissions: ["View Receipts", "View Audit Logs", "Export Reports"],
  },
];

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);

  // Modal Control States
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
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Roles & Access Permissions
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Configure system roles, access levels, and user privilege assignments.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Create New Role</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="max-w-md">
        <CustomInput
          placeholder="Search roles or permissions..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Roles Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => {
          const visiblePermissions = role.permissions.slice(0, 3);
          const remainingCount = role.permissions.length - visiblePermissions.length;

          return (
            <Card
              key={role.id}
              className="relative flex flex-col justify-between border-border bg-card shadow-xs transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-card-foreground">
                        {role.name}
                      </CardTitle>
                      {role.isSystem && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                          <Lock className="h-3 w-3" /> System Role
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(role)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Edit role"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <CardDescription className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {role.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* User Count */}
                <div className="flex items-center gap-2 border-t border-border/80 pt-3 text-xs text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{role.userCount}</span>
                  <span>Assigned users</span>
                </div>

                {/* Permissions Subset with See Details Trigger */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Permissions Included
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {visiblePermissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-1 text-[11px] font-medium text-foreground"
                      >
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {perm}
                      </span>
                    ))}

                    {/* See Details Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(role)}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      {remainingCount > 0 ? `+${remainingCount} more...` : "See details"}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 1. Modal for viewing/updating details & permissions */}
      <RoleDetailModal
        isOpen={isDetailModalOpen}
        role={selectedRole}
        onClose={() => setIsDetailModalOpen(false)}
        onSaveRole={handleSaveRole}
      />

      {/* 2. Modal for adding a new role */}
      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRole={handleAddRole}
      />
    </div>
  );
}