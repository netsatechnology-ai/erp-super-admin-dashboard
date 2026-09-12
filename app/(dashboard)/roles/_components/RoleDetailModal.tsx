"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ShieldCheck, Check, Lock, X, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { hideLoader, showLoader } from "@/lib/redux/slices/loadingSlice";
import { RoleService } from "@/services/RoleService";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { useAppDispatch } from "@/lib/redux/store";

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionKeys: string[];
  isSystem?: boolean;
  status: string;
}

export interface Permission {
  key: string;
  label: string;
  description?: string;
  domain?: string;
}

export interface PermissionDomain {
  domain: string;
  permissionKeys: Permission[];
}

interface RoleDetailModalProps {
  isOpen: boolean;
  role: Role | null;
  permissions?: any[];
  onClose: () => void;
  onSaveRole: (updatedRole: Role) => void;
}

export function RoleDetailModal({
  isOpen,
  role,
  permissions = [],
  onClose,
  onSaveRole,
}: RoleDetailModalProps) {
  const dispatch = useAppDispatch();

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedpermissionKeys, setSelectedpermissionKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role) {
      setRoleName(role.name || "");
      setDescription(role.description || "");
      setSelectedpermissionKeys(role.permissionKeys || []);
      setStatus(role.status || "ACTIVE");
    }
  }, [role, isOpen]);

  // Group raw permissions prop by domain using useMemo
  const permissionDomains = useMemo(() => {
    if (!Array.isArray(permissions) || permissions.length === 0) return [];

    const domainMap: Record<string, Permission[]> = {};

    permissions.forEach((perm) => {
      const key = perm.key || perm.name || perm.id;
      const label = perm.label || perm.name || key;
      const permDescription = perm.description || "";

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
        description: permDescription,
        domain: formattedDomain,
      });
    });

    return Object.entries(domainMap).map(([domain, items]) => ({
      domain,
      permissionKeys: items,
    }));
  }, [permissions]);

  if (!isOpen || !role) return null;

  const togglePermission = (key: string) => {
    if (role.isSystem || isSubmitting) return;
    setSelectedpermissionKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

 const handleToggleStatus = async (newStatus: "ACTIVE" | "INACTIVE") => {
    setIsSubmitting(true);
    dispatch(showLoader());

    const isActivating = newStatus === "ACTIVE";

    try {
      await RoleService.updateRoleStatus(role.id, { status: newStatus });

      setStatus(newStatus);
      const updatedRole = { ...role, status: newStatus };
      onSaveRole(updatedRole);

      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "success",
          title: isActivating ? "Role Activated" : "Role Deactivated",
          message: isActivating
            ? `Role "${role.name}" has been successfully activated.`
            : `Role "${role.name}" has been successfully deactivated.`,
          buttonText: "Done",
        })
      );
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: isActivating ? "Activation Failed" : "Deactivation Failed",
          message:
            error?.response?.data?.message ||
            `Unable to ${isActivating ? "activate" : "deactivate"} role. Please try again.`,
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    dispatch(showLoader());

    const isDescriptionChanged = description !== (role.description || "");
    const initialPerms = [...(role.permissionKeys || [])].sort().join(",");
    const currentPerms = [...selectedpermissionKeys].sort().join(",");
    const arePermissionsChanged = initialPerms !== currentPerms;

    try {
      const apiCalls: Promise<any>[] = [];

      // Endpoint 1: Description Update
      if (isDescriptionChanged) {
        if (RoleService.updateRoleDescription) {
          apiCalls.push(
            RoleService.updateRoleDescription(role.id, { description })
          );
        } 
      }

      // Endpoint 2: Permissions Assignment Update
      if (arePermissionsChanged) {
        if (RoleService.assignPermissionsToRole) {
          apiCalls.push(
            RoleService.assignPermissionsToRole(role.id, {
              permissionKeys: selectedpermissionKeys,
            })
          );
        } 
      }

      if (apiCalls.length > 0) {
        await Promise.all(apiCalls);
      }

      dispatch(hideLoader());

      const updatedRole: Role = {
        ...role,
        description,
        permissionKeys: selectedpermissionKeys,
        status,
      };

      onSaveRole(updatedRole);

      dispatch(
        showResponseModal({
          status: "success",
          title: "Role Updated",
          message: `Role "${role.name}" has been updated successfully.`,
          buttonText: "Done",
        })
      );

      onClose();
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: "Update Failed",
          message:
            error?.response?.data?.message ||
            "Unable to update role. Please try again.",
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-4 space-y-4">
          <CustomInput
            label="Role Name"
            value={roleName}
            disabled={true}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={role.isSystem || isSubmitting}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring disabled:opacity-70"
            />
          </div>

          {/* Permissions Grid Grouped by Domain */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Permission Assignment ({selectedpermissionKeys.length})
              </span>
              {role.isSystem && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <Lock className="h-3 w-3" /> System Managed
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background/50 p-4 space-y-4 min-h-30">
              {permissionDomains.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-xs text-muted-foreground font-medium">
                  No permissions found.
                </div>
              ) : (
                permissionDomains.map((domainGroup) => (
                  <div key={domainGroup.domain} className="space-y-2">
                    <h4 className="border-b border-border/50 pb-1 text-xs font-bold text-foreground">
                      {domainGroup.domain}
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {domainGroup.permissionKeys.map((perm) => {
                        const isChecked = selectedpermissionKeys.includes(perm.key);
                        return (
                          <div
                            key={perm.key}
                            title={perm.description}
                            onClick={() => togglePermission(perm.key)}
                            className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition-all text-left ${
                              role.isSystem || isSubmitting
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
                ))
              )}
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
                  disabled={isSubmitting}
                  onClick={() => handleToggleStatus("INACTIVE")}
                  className="cursor-pointer gap-1.5 text-xs font-semibold"
                >
                  <PowerOff className="h-3.5 w-3.5" /> Deactivate Role
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => handleToggleStatus("ACTIVE")}
                  className="cursor-pointer gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Power className="h-3.5 w-3.5" /> Activate Role
                </Button>
              ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            {!role.isSystem && (
              <Button
                onClick={() => handleSave()}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}