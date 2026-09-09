"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Check, Lock, X, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem?: boolean;
  status: string;
}

export interface Permission {
  key: string;
  label: string;
  description: string;
}

export interface PermissionDomain {
  domain: string;
  permissions: Permission[];
}

export const PERMISSION_DOMAINS: PermissionDomain[] = [
  {
    domain: "Dashboard",
    permissions: [
      {
        key: "dashboard:system:view",
        label: "View System Dashboard",
        description: "View global platform metrics and system-wide dashboards",
      },
      {
        key: "dashboard:merchant:view",
        label: "View Merchant Dashboard",
        description: "View merchant-specific performance metrics and revenue dashboards",
      },
    ],
  },
  {
    domain: "Transactions",
    permissions: [
      {
        key: "transaction:read",
        label: "Read Transactions",
        description: "View list and details of processed financial transactions",
      },
      {
        key: "transaction:refund",
        label: "Refund Transaction",
        description: "Initiate payment refunds for customer transactions",
      },
      {
        key: "transaction:export",
        label: "Export Transactions",
        description: "Export transaction history logs to CSV/Excel",
      },
    ],
  },
  {
    domain: "Invoicing",
    permissions: [
      {
        key: "invoice:create",
        label: "Create Invoice",
        description: "Generate new sales invoices for customers",
      },
      {
        key: "invoice:read",
        label: "Read Invoice",
        description: "View sales invoice details, line items, and payment status",
      },
      {
        key: "invoice:update",
        label: "Update Invoice",
        description: "Edit draft or unpaid sales invoices",
      },
      {
        key: "invoice:cancel",
        label: "Cancel Invoice",
        description: "Void or cancel generated sales invoices",
      },
      {
        key: "invoice:print",
        label: "Print Invoice",
        description: "Download or print PDF sales invoices",
      },
    ],
  },
  {
    domain: "Inventory",
    permissions: [
      {
        key: "inventory:item:create",
        label: "Create Item",
        description: "Add new products and variants to the inventory catalog",
      },
      {
        key: "inventory:item:read",
        label: "Read Item",
        description: "View catalog products, pricing, and item specifications",
      },
      {
        key: "inventory:item:update",
        label: "Update Item",
        description: "Modify product details, pricing, and category assignments",
      },
      {
        key: "inventory:item:delete",
        label: "Delete Item",
        description: "Remove products from the merchant catalog",
      },
    ],
  },
  {
    domain: "Warehouse & Stock",
    permissions: [
      {
        key: "stock:level:read",
        label: "Read Stock Levels",
        description: "View current stock levels, low-stock alerts, and warehouse counts",
      },
      {
        key: "stock:adjust",
        label: "Adjust Stock",
        description: "Perform manual stock count adjustments and reconciliation",
      },
      {
        key: "stock:transfer",
        label: "Transfer Stock",
        description: "Transfer stock between different store locations or warehouses",
      },
      {
        key: "stock:supplier:manage",
        label: "Manage Suppliers",
        description: "Create and manage stock supplier profiles and purchase orders",
      },
    ],
  },
  {
    domain: "System Admin",
    permissions: [
      {
        key: "system:superadmin",
        label: "Super Admin Access",
        description: "Full platform access to manage system configuration and all tenants",
      },
      {
        key: "system:audit_logs:read",
        label: "Read Audit Logs",
        description: "View system-wide security and access audit logs",
      },
    ],
  },
  {
    domain: "User Management",
    permissions: [
      {
        key: "user:create",
        label: "Create User",
        description: "Create new user accounts in the platform",
      },
      {
        key: "user:read",
        label: "Read Users",
        description: "View basic details and status of user profiles",
      },
      {
        key: "user:update",
        label: "Update User",
        description: "Update basic user profile details",
      },
      {
        key: "user:delete",
        label: "Delete User",
        description: "Deactivate or delete user accounts",
      },
      {
        key: "user:status:change",
        label: "Change User Status",
        description: "Change user account operational status (e.g., Active, Suspended)",
      },
    ],
  },
  {
    domain: "Merchant Management",
    permissions: [
      {
        key: "merchant:create",
        label: "Create Merchant",
        description: "Register new merchant entities",
      },
      {
        key: "merchant:read",
        label: "Read Merchant",
        description: "View merchant profile, business license, and contact details",
      },
      {
        key: "merchant:update",
        label: "Update Merchant",
        description: "Update merchant profile and management contact information",
      },
      {
        key: "merchant:delete",
        label: "Delete Merchant",
        description: "Archive or soft-delete merchant accounts",
      },
      {
        key: "merchant:status:change",
        label: "Change Merchant Status",
        description: "Approve, suspend, or change merchant operational status",
      },
    ],
  },
  {
    domain: "Category Management",
    permissions: [
      {
        key: "merchant_category:create",
        label: "Create Category",
        description: "Add new merchant categories",
      },
      {
        key: "merchant_category:read",
        label: "Read Category",
        description: "View merchant categories and status",
      },
      {
        key: "merchant_category:update",
        label: "Update Category",
        description: "Update existing merchant category names or details",
      },
      {
        key: "merchant_category:delete",
        label: "Delete Category",
        description: "Delete or deactivate unused merchant categories",
      },
    ],
  },
  {
    domain: "Access Control",
    permissions: [
      {
        key: "role:create",
        label: "Create Role",
        description: "Create custom roles within a merchant tenant or globally",
      },
      {
        key: "role:read",
        label: "Read Roles",
        description: "View roles and assigned system permissions",
      },
      {
        key: "role:update",
        label: "Update Role",
        description: "Modify existing role names and permission assignments",
      },
      {
        key: "role:delete",
        label: "Delete Role",
        description: "Delete unassigned roles",
      },
    ],
  },
  {
    domain: "Tenant Roles",
    permissions: [
      {
        key: "user_role:assign",
        label: "Assign User Role",
        description: "Assign roles to users within a merchant context",
      },
      {
        key: "user_role:revoke",
        label: "Revoke User Role",
        description: "Revoke user roles within a merchant context",
      },
      {
        key: "user_role:read",
        label: "Read User Roles",
        description: "View current user-merchant role assignments",
      },
    ],
  },
];

interface RoleDetailModalProps {
  isOpen: boolean;
  role: Role | null;
  onClose: () => void;
  onSaveRole: (updatedRole: Role) => void;
}

export function RoleDetailModal({
  isOpen,
  role,
  onClose,
  onSaveRole,
}: RoleDetailModalProps) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("ACTIVE");

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setDescription(role.description);
      setSelectedPermissions(role.permissions || []);
      setStatus(role.status || "ACTIVE");
    }
  }, [role]);

  if (!isOpen || !role) return null;

  const togglePermission = (key: string) => {
    if (role.isSystem) return;
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleToggleStatus = (newStatus: "ACTIVE" | "DEACTIVATED") => {
    setStatus(newStatus);
    onSaveRole({
      ...role,
      name: roleName,
      description,
      permissions: selectedPermissions,
      status: newStatus,
    });
  };

  const handleSave = () => {
    onSaveRole({
      ...role,
      name: roleName,
      description,
      permissions: selectedPermissions,
      status,
    });
    onClose();
  };

  const isActive = status.toUpperCase() === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Role Details & Permissions
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                View and configure access capabilities for {role.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-4 space-y-4">
          <CustomInput
            label="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            disabled={role.isSystem}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={role.isSystem}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring disabled:opacity-70"
            />
          </div>

          {/* Permissions Grid Grouped by Domain */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Permissions Assignment ({selectedPermissions.length})
              </span>
              {role.isSystem && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <Lock className="h-3 w-3" /> System Managed
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background/50 p-4 space-y-4">
              {PERMISSION_DOMAINS.map((domainGroup) => (
                <div key={domainGroup.domain} className="space-y-2">
                  <h4 className="border-b border-border/50 pb-1 text-xs font-bold text-foreground">
                    {domainGroup.domain}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {domainGroup.permissions.map((perm) => {
                      const isChecked = selectedPermissions.includes(perm.key);
                      return (
                        <div
                          key={perm.key}
                          title={perm.description}
                          onClick={() => togglePermission(perm.key)}
                          className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition-all text-left ${
                            role.isSystem
                              ? "cursor-not-allowed opacity-80"
                              : "cursor-pointer"
                          } ${
                            isChecked
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border bg-card text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <div className="flex flex-col pr-2">
                            <span>{perm.label}</span>
                            <span className="text-[10px] opacity-70 font-mono">
                              {perm.key}
                            </span>
                          </div>
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                              isChecked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background"
                            }`}
                          >
                            {isChecked && (
                              <Check className="h-3 w-3 stroke-3" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <div>
            {!role.isSystem &&
              (isActive ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleToggleStatus("DEACTIVATED")}
                  className="cursor-pointer gap-1.5 text-xs font-semibold"
                >
                  <PowerOff className="h-3.5 w-3.5" /> Deactivate Role
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleToggleStatus("ACTIVE")}
                  className="cursor-pointer gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Power className="h-3.5 w-3.5" /> Activate Role
                </Button>
              ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!role.isSystem && (
              <Button onClick={handleSave}>Save Changes</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}