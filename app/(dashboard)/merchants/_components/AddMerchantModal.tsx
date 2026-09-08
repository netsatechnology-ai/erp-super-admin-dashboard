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
  CheckCircle2,
  FileBadge,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { Merchant } from "../types";
import { MerchantService } from "@/services/MerchantService";
import { useAppDispatch } from "@/lib/redux/store";
import { showLoader, hideLoader } from "@/lib/redux/slices/loadingSlice";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";

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

export function AddMerchantModal({
  isOpen,
  onClose,
  onAddMerchant,
}: AddMerchantModalProps) {
  const dispatch = useAppDispatch();

  // Empty initial states to reveal field placeholders
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tinNumber, setTinNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [managerIdFile, setManagerIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setCategory(CATEGORIES[0]);
    setTinNumber("");
    setManagerName("");
    setContactPhone("");
    setLicenseFile(null);
    setManagerIdFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleManagerIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManagerIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    dispatch(showLoader("Onboarding merchant node..."));

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("tinNumber", tinNumber);
      formData.append("managerName", managerName);
      formData.append("contactPhone", contactPhone);

      if (licenseFile) {
        formData.append("licenseFile", licenseFile);
      }
      if (managerIdFile) {
        formData.append("managerIdFile", managerIdFile);
      }

      const response = await MerchantService.addMerchant(formData);

      dispatch(hideLoader());

      if (response) {
        // Fallback fallback object formatting if backend returns basic payload
        const createdMerchant: Merchant = response.data || {
          id: response.data.id || `mch-${Date.now()}`,
          name,
          category,
          tinNumber,
          managerName,
          contactPhone,
          status: "APPROVED",
          licenseFile: licenseFile?.name || "Trade_License.pdf",
          managerIdFile: managerIdFile?.name || "Manager_ID.pdf",
          createdAt: new Date().toISOString().split("T")[0],
          outletsCount: 1,
        };

        onAddMerchant(createdMerchant);
        handleClose();

        dispatch(
          showResponseModal({
            status: "success",
            title: "Merchant Onboarded",
            message: `Merchant node "${name}" has been successfully onboarded.`,
            buttonText: "Done",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Onboarding Failed",
            message: "Unable to create merchant account. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: "Registration Error",
          message:
            error?.response?.data?.message ||
            "An error occurred while connecting to MerchantService.",
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={handleClose}
            type="button"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="px-6 pt-3 text-xs font-medium text-muted-foreground">
          Register a new tenant account with licensing and manager credentials.
        </p>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Merchant Name & Category */}
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

          {/* Row 2: TIN Number */}
          <CustomInput
            label="TIN NUMBER"
            requiredStar
            leftIcon={<FileBadge className="h-4 w-4" />}
            rightIcon={
              tinNumber.length >= 10 ? (
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : null
            }
            topRightBadge={
              tinNumber.length >= 10 ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid Format
                </span>
              ) : null
            }
            placeholder="e.g. 0049281729"
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
            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-900/40 p-5 text-center cursor-pointer transition-colors hover:border-indigo-400">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleLicenseUpload}
                className="hidden"
              />
              <div className="rounded-xl bg-indigo-100 dark:bg-indigo-950/80 p-3 text-indigo-600 dark:text-indigo-400 mb-2">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-foreground">
                Click to upload or drag Trade License PDF/PNG
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Maximum file size 10MB (PDF, PNG, JPG accepted)
              </p>

              {licenseFile && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-background px-3 py-1.5 text-xs font-medium border border-border shadow-xs">
                  <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-foreground">{licenseFile.name}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              )}
            </label>
          </div>

          {/* Row 3: Manager Name & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              label="MANAGER FULL NAME"
              requiredStar
              leftIcon={<User className="h-4 w-4" />}
              placeholder="e.g. Kaleb Worku"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              required
            />

            <CustomInput
              label="CONTACT PHONE"
              requiredStar
              leftIcon={<Phone className="h-4 w-4" />}
              placeholder="e.g. +251 911 448 839"
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
                    {managerIdFile
                      ? managerIdFile.name
                      : "Upload Manager National ID / Passport scan"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Front and reverse scan verified under KYC Tier 2
                  </p>
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleManagerIdUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-bold uppercase text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors">
                  {managerIdFile ? "CHANGE" : "BROWSE"}
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 text-xs font-bold text-muted-foreground rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name || !tinNumber || !managerName || !contactPhone}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 rounded-xl shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Onboarding...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Save & Onboard Merchant</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}