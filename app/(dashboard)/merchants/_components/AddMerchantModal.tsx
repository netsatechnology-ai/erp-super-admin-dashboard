"use client";

import { useState } from "react";
import {
  X,
  Store,
  UploadCloud,
  FileText,
  User,
  Phone,
  ShieldCheck,
  Info,
  CheckCircle2,
  FileBadge
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { CustomInput } from "@/components/ui/CustomInput";
import { Merchant } from "../types";
import { CustomInput } from "@/components/ui/CustomInput";

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerchant: (merchant: Merchant) => void;
}

const CATEGORIES = [
  "Retail & Supermarket",
  "Pharmacy & Healthcare",
  "Restaurant & Cafe",
  "Logistics & Express",
  "Hospitality & Hotel",
  "Electronics & Appliances",
];

export function AddMerchantModal({ isOpen, onClose, onAddMerchant }: AddMerchantModalProps) {
  const [name, setName] = useState("Sunrise Grocery Hub");
  const [category, setCategory] = useState("Retail & Supermarket");
  const [tinNumber, setTinNumber] = useState("0049281729");
  const [managerName, setManagerName] = useState("Kaleb Worku");
  const [contactPhone, setContactPhone] = useState("+251 911 448 839");
  const [licenseFileName, setLicenseFileName] = useState("Trade_License_Sunrise_2025.pdf (1.8 MB)");
  const [managerIdFileName, setManagerIdFileName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMerchant: Merchant = {
      id: `mch-${Date.now()}`,
      name,
      category,
      tinNumber,
      managerName,
      contactPhone,
      status: "APPROVED",
      licenseFile: licenseFileName,
      managerIdFile: managerIdFileName || "Manager_National_ID.pdf",
      createdAt: new Date().toISOString().split("T")[0],
      outletsCount: 1,
    };
    onAddMerchant(newMerchant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="h-3 w-3 rounded-full bg-indigo-600" />
            <h2 className="text-lg font-black tracking-tight text-foreground">
              Add New Merchant
            </h2>
            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
              TENANT NODE
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="px-6 pt-3 text-xs font-medium text-muted-foreground">
          Register a new tenant account with licensing and manager credentials.
        </p>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Merchant Name & Category using CustomInput */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              label="MERCHANT NAME"
              requiredStar
              leftIcon={<Store className="h-4 w-4" />}
              placeholder="e.g. Sunrise Grocery Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <CustomInput
              label="MERCHANT CATEGORY"
              requiredStar
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </CustomInput>
          </div>

          {/* Row 2: TIN Number using CustomInput */}
          <CustomInput
            label="TIN NUMBER"
            requiredStar
            leftIcon={<FileBadge className="h-4 w-4" />}
            rightIcon={<ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
            topRightBadge={
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Valid Format
              </span>
            }
            placeholder="0049281729"
            className="font-mono font-bold"
            value={tinNumber}
            onChange={(e) => setTinNumber(e.target.value)}
            required
          />

          {/* Business License Upload Area */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              BUSINESS LICENSE UPLOAD <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-900/40 p-5 text-center transition-colors hover:border-indigo-400">
              <div className="rounded-xl bg-indigo-100 dark:bg-indigo-950/80 p-3 text-indigo-600 dark:text-indigo-400 mb-2">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-foreground">
                Click to upload or drag Trade License PDF/PNG
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Maximum file size 10MB (PDF, PNG, JPG accepted)
              </p>

              {licenseFileName && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-background px-3 py-1.5 text-xs font-medium border border-border shadow-xs">
                  <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-foreground">{licenseFileName}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Manager Name & Contact Phone using CustomInput */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              label="MANAGER FULL NAME"
              requiredStar
              leftIcon={<User className="h-4 w-4" />}
              placeholder="Kaleb Worku"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              required
            />

            <CustomInput
              label="CONTACT PHONE"
              requiredStar
              leftIcon={<Phone className="h-4 w-4" />}
              placeholder="+251 911 448 839"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          {/* Manager ID Upload Banner */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              MANAGER ID UPLOAD <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center justify-between rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-slate-900/50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 dark:bg-indigo-950 p-2 text-indigo-600">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Upload Manager National ID / Passport scan
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Front and reverse scan verified under KYC Tier 2
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setManagerIdFileName("Manager_Passport_Scan.pdf")}
                className="text-xs font-bold uppercase text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
              >
                BROWSE
              </Button>
            </div>
          </div>



          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 text-xs font-bold text-muted-foreground rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 rounded-xl shadow-xs"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Save & Onboard Merchant</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}