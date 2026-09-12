"use client";

import { useEffect, useState } from "react";
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
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { Merchant } from "../types";
import { MerchantService } from "@/services/MerchantService";
import { useAppDispatch } from "@/lib/redux/store";
import { showLoader, hideLoader } from "@/lib/redux/slices/loadingSlice";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { CategoryItem } from "../../merchant-categories/types";

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerchant: (merchant: Merchant) => void;
}

export function AddMerchantModal({
  isOpen,
  onClose,
  onAddMerchant,
}: AddMerchantModalProps) {
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tinNumber, setTinNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [managerIdFile, setManagerIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await MerchantService.fetchCatagoriesForDropDown();
      if (response?.status && Array.isArray(response.data)) {
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(String(response.data[0].id));
        }
      }
    } catch (error: any) {
      dispatch(
        showResponseModal({
          status: "error",
          message: error.message || "Failed to get category list",
          buttonText: "Try Again",
        })
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setCategoryId(categories.length > 0 ? String(categories[0].id) : "");
    setTinNumber("");
    setManagerName("");
    setContactPhone("");
    setPassword("");
    setShowPassword(false);
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
      formData.append("categoryId", categoryId);
      formData.append("tin", tinNumber);
      formData.append("managerFullName", managerName);
      formData.append("managerPhoneNumber", contactPhone);
      formData.append("password", password);

      if (licenseFile) {
        formData.append("businessLicense", licenseFile);
      }
      if (managerIdFile) {
        formData.append("managerId", managerIdFile);
      }

      const response = await MerchantService.addMerchant(formData);

      dispatch(hideLoader());

      if (response) {
        const selectedCatName =
          categories.find((c) => String(c.id) === categoryId)?.name || "General";

        const createdMerchant: Merchant = response.data || {
          id: response.data?.id || `mch-${Date.now()}`,
          name,
          category: selectedCatName,
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
      }
    } catch (error: any) {
      dispatch(hideLoader());

      const status = error?.response?.status;
      let errorMessage = "An error occurred while onboarding merchant.";

      if (status === 404) {
        errorMessage = "The merchant onboarding endpoint was not found on the server.";
      } else if (error?.response?.data) {
        const serverData = error.response.data;
        errorMessage =
          typeof serverData === "string"
            ? serverData
            : serverData.message || serverData.error || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      dispatch(
        showResponseModal({
          status: "error",
          title: status ? `Request Error (${status})` : "Registration Error",
          message: errorMessage,
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-auto my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh]">
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
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="px-6 pt-3 text-xs font-medium text-muted-foreground">
          Register a new tenant account with licensing and manager credentials.
        </p>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              label="MERCHANT NAME"
              requiredStar
              leftIcon={<Store className="h-4 w-4" />}
              placeholder="e.g. Sunrise Grocery Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />

            <CustomInput
              label="MERCHANT CATEGORY"
              requiredStar
              as="select"
              value={categoryId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCategoryId(e.target.value)
              }
              disabled={isSubmitting || categories.length === 0}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </CustomInput>
          </div>

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
            disabled={isSubmitting}
            required
          />

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              BUSINESS LICENSE UPLOAD <span className="text-rose-500">*</span>
            </label>
            <label
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-900/40 p-5 text-center transition-colors hover:border-indigo-400 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleLicenseUpload}
                disabled={isSubmitting}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              label="MANAGER FULL NAME"
              requiredStar
              leftIcon={<User className="h-4 w-4" />}
              placeholder="e.g. Kaleb Worku"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              disabled={isSubmitting}
              required
            />

            <CustomInput
              label="MANAGER PHONE"
              requiredStar
              leftIcon={<Phone className="h-4 w-4" />}
              placeholder="e.g. +251 911 448 839"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <CustomInput
            label="ACCOUNT PASSWORD"
            requiredStar
            type={showPassword ? "text" : "password"}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            placeholder="Enter temporary password for manager account"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />

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
              <label
                className={`cursor-pointer ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleManagerIdUpload}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-bold uppercase text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors">
                  {managerIdFile ? "CHANGE" : "BROWSE"}
                </span>
              </label>
            </div>
          </div>

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
              disabled={
                isSubmitting ||
                !name ||
                !tinNumber ||
                !managerName ||
                !contactPhone ||
                !password
              }
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