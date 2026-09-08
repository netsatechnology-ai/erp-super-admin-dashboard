"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Store, 
  FileBadge, 
  User, 
  Phone, 
  Calendar, 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Merchant, MerchantStatus } from "../types";

interface MerchantDetailModalProps {
  isOpen: boolean;
  merchant: Merchant | null;
  onClose: () => void;
  onUpdateMerchant: (updated: Merchant) => void;
}

export function MerchantDetailModal({
  isOpen,
  merchant,
  onClose,
  onUpdateMerchant,
}: MerchantDetailModalProps) {
  const [formData, setFormData] = useState<Merchant | null>(null);

  useEffect(() => {
    setFormData(merchant);
  }, [merchant]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (formData) {
      onUpdateMerchant(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-black tracking-tight text-foreground">
              Merchant Information & Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Badge Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3.5">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Verification & Clearance Status
              </span>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                Update account clearance state for operational access.
              </p>
            </div>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as MerchantStatus })
              }
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-extrabold cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="APPROVED">APPROVED</option>
              <option value="COMPLETE">COMPLETE</option>
              <option value="INCOMPLETE">INCOMPLETE PROFILE</option>
            </select>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Merchant Business Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-bold text-foreground focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-semibold text-foreground focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                TIN Number
              </label>
              <input
                type="text"
                value={formData.tinNumber}
                onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-mono font-bold text-foreground focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Assigned Manager
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-bold text-foreground focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Manager Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-semibold text-foreground focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Registration Date
              </label>
              <input
                type="text"
                disabled
                value={formData.createdAt}
                className="w-full rounded-xl border border-border bg-muted/50 py-2 px-3 text-xs font-mono text-muted-foreground"
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="border-t border-border/80 pt-4 space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Attached Compliance Verification Documents
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-medium text-foreground truncate max-w-40">
                    {formData.licenseFile || "Trade_License.pdf"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-medium text-foreground truncate max-w-40">
                    {formData.managerIdFile || "Manager_National_ID.pdf"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">KYC TIER 2</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 text-xs font-bold text-muted-foreground rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 rounded-xl shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}