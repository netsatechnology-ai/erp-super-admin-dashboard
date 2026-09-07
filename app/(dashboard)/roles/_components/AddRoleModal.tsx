"use client";

import { useState } from "react";
import { ShieldPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";
import { Role } from "./RoleDetailModal";

export const AVAILABLE_PERMISSIONS = [
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

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (newRole: Role) => void;
}

export function AddRoleModal({ isOpen, onClose, onAddRole }: AddRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  if (!isOpen) return null;

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name,
      description,
      userCount: 0,
      permissions: selectedPermissions,
      isSystem: false,
    };

    onAddRole(newRole);
    setName("");
    setDescription("");
    setSelectedPermissions([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Create New Role
              </h3>
              <p className="text-xs text-muted-foreground">
                Define access rules and assign initial permissions
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <CustomInput
            label="Role Title"
            placeholder="e.g., Compliance Officer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of role responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Select Initial Permissions */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Initial Permissions ({selectedPermissions.length})
            </label>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-background/50 p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {AVAILABLE_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm);
                  return (
                    <button
                      type="button"
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={`flex items-center justify-between rounded-lg border p-2 text-xs font-medium transition-all ${
                        isChecked
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <span>{perm}</span>
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          isChecked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </div>
    </div>
  );
}