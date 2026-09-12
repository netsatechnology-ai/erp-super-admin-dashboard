"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ShieldPlus, Check, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { Role } from "./RoleDetailModal";
import { hideLoader, showLoader } from "@/lib/redux/slices/loadingSlice";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { RoleService } from "@/services/RoleService";

export interface Permission {
  key: string;
  label: string;
  description?: string;
  domain?: string;
}

export interface PermissionDomain {
  domain: string;
  permissions: Permission[];
}

interface AddRoleModalProps {
  isOpen: boolean;
  permissions?: any[];
  onClose: () => void;
  onAddRole: (newRole: Role) => void;
}

export function AddRoleModal({
  isOpen,
  permissions = [],
  onClose,
  onAddRole,
}: AddRoleModalProps) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group raw permissions prop by domain using useMemo
  const permissionDomains = useMemo(() => {
    if (!Array.isArray(permissions) || permissions.length === 0) return [];

    const domainMap: Record<string, Permission[]> = {};

    permissions.forEach((perm) => {
      const key = perm.key || perm.name || perm.id;
      const label = perm.label || perm.name || key;
      const description = perm.description || "";

      const domainName =
        perm.domain ||
        (key.includes(":") ? key.split(":")[0] : "General");

      const formattedDomain = domainName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase());

      if (!domainMap[formattedDomain]) {
        domainMap[formattedDomain] = [];
      }

      domainMap[formattedDomain].push({
        key,
        label,
        description,
        domain: formattedDomain,
      });
    });

    return Object.entries(domainMap).map(([domain, items]) => ({
      domain,
      permissions: items,
    }));
  }, [permissions]);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setName("");
    setDescription("");
    setSelectedPermissions([]);
    onClose();
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    dispatch(showLoader());

    try {
      const payload = {
        name,
        description,
        permissionKeys: selectedPermissions,
      };

      const response = await RoleService.addRole(payload);

      dispatch(hideLoader());

      if (response) {
        const createdRole: Role = response.data || {
          id: response.data?.id || `role-${Date.now()}`,
          name,
          description,
          userCount: 0,
          permissions: selectedPermissions,
          isSystem: false,
          status: "ACTIVE",
        };

        onAddRole(createdRole);
        handleResetAndClose();

        dispatch(
          showResponseModal({
            status: "success",
            title: "Role Created",
            message: `Role "${name}" has been successfully created.`,
            buttonText: "Done",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Role Creation Failed",
            message: "Unable to create role. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: "Error",
          message:
            error?.response?.data?.message ||
            "An error occurred while creating the role.",
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl">
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
            onClick={handleResetAndClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50 cursor-pointer"
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
            disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>

          {/* Categorized Permissions Container */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Initial Permissions ({selectedPermissions.length})
            </label>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background/50 p-4 space-y-4 min-h-[120px]">
              {permissionDomains.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-xs text-muted-foreground font-medium">
                  No permissions found.
                </div>
              ) : (
                permissionDomains.map((domainGroup) => (
                  <div key={domainGroup.domain} className="space-y-2">
                    <h4 className="text-xs font-bold text-foreground border-b border-border/50 pb-1">
                      {domainGroup.domain}
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {domainGroup.permissions.map((perm) => {
                        const isChecked = selectedPermissions.includes(perm.key);
                        return (
                          <button
                            type="button"
                            key={perm.key}
                            title={perm.description}
                            disabled={isSubmitting}
                            onClick={() => togglePermission(perm.key)}
                            className={`group relative flex items-center justify-between rounded-lg border p-2 text-xs font-medium transition-all text-left disabled:opacity-50 cursor-pointer ${
                              isChecked
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:bg-accent"
                            }`}
                          >
                            <div className="flex flex-col pr-2">
                              <span>{perm.label}</span>
                            </div>
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                isChecked
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background"
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3 stroke-3" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetAndClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}