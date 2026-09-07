"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Check, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem?: boolean;
}

const ALL_SYSTEM_PERMISSIONS = [
  "Create Merchants",
  "Update Merchant Details",
  "Approve Merchants",
  "View Receipts",
  "View Statistics",
  "User Management",
  "Roles & Permissions",
  "View Audit Logs",
  "Export Reports",
  "Refund Processing",
  "Manage API Keys",
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

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setDescription(role.description);
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  if (!isOpen || !role) return null;

  const togglePermission = (perm: string) => {
    if (role.isSystem) return; // Prevent modifying core system roles if needed
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSave = () => {
    onSaveRole({
      ...role,
      name: roleName,
      description,
      permissions: selectedPermissions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Role Details & Permissions
              </h3>
              <p className="text-xs text-muted-foreground">
                View and configure access capabilities for {role.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
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
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Permissions Grid */}
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

            <div className="max-h-60 overflow-y-auto rounded-xl border border-border bg-background/50 p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ALL_SYSTEM_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm);
                  return (
                    <label
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition-all ${
                        isChecked
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      } ${role.isSystem ? "cursor-not-allowed opacity-80" : ""}`}
                    >
                      <span>{perm}</span>
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          isChecked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!role.isSystem && (
            <Button onClick={handleSave}>Save Changes</Button>
          )}
        </div>
      </div>
    </div>
  );
}