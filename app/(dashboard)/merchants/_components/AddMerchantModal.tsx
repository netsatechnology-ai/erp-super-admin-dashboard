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

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerchant: (merchant: Merchant) => void;
}

const CATEGORIES =  [
        {
            "id": "82c9f224-7d1d-41de-8b14-9c15713ff7ee",
            "name": "AuditCat-1789001190029",
            "code": null,
            "description": null,
            "defaultTaxPolicy": null,
            "status": "ACTIVE",
            "createdDate": "2026-09-10T00:46:30.033Z",
            "updatedDate": "2026-09-10T00:46:30.033Z",
            "linkedMerchantCount": 1
        },
        {
            "id": "06c6abdd-d66c-4713-a454-09759db4c2f8",
            "name": "AuditCat-1789001212395",
            "code": null,
            "description": null,
            "defaultTaxPolicy": null,
            "status": "ACTIVE",
            "createdDate": "2026-09-10T00:46:52.399Z",
            "updatedDate": "2026-09-10T00:46:52.399Z",
            "linkedMerchantCount": 1
        },
        {
            "id": "3aefdeb8-60f1-4dc9-a635-cc54e218dfa9",
            "name": "food",
            "code": "FFF",
            "description": "dewscccc",
            "defaultTaxPolicy": "VAT 15% + SC 10%",
            "status": "ACTIVE",
            "createdDate": "2026-09-10T05:14:35.146Z",
            "updatedDate": "2026-09-10T05:14:35.146Z",
            "linkedMerchantCount": 0
        },
        {
            "id": "98a4a928-12ba-475f-ab8c-634f119010ec",
            "name": "Retail",
            "code": "RTL",
            "description": "Retail shops and FMCG outlets",
            "defaultTaxPolicy": "VAT 15% (Standard Output)",
            "status": "ACTIVE",
            "createdDate": "2026-09-08T18:19:44.231Z",
            "updatedDate": "2026-09-08T18:21:50.070Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "5ec1b7cf-7f88-4eec-8e3e-0bee8c3d95f5",
            "name": "Retail-1788933866104",
            "code": "C3866104",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T06:04:26.605Z",
            "updatedDate": "2026-09-09T06:04:28.815Z",
            "linkedMerchantCount": 3
        },
        {
            "id": "89d9df4b-5c7e-4966-8b8c-000668ddf3d9",
            "name": "Retail-1788933891240",
            "code": "C3891240",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T06:04:51.791Z",
            "updatedDate": "2026-09-09T06:04:54.530Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "d45e1568-e088-48b1-869f-b7438cc8fd70",
            "name": "Retail-1788941988422",
            "code": null,
            "description": null,
            "defaultTaxPolicy": null,
            "status": "ACTIVE",
            "createdDate": "2026-09-09T08:19:48.873Z",
            "updatedDate": "2026-09-09T08:19:48.873Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "83012cb1-9184-44ac-9589-3c9cd75e2714",
            "name": "Retail-1788942073578",
            "code": null,
            "description": null,
            "defaultTaxPolicy": null,
            "status": "ACTIVE",
            "createdDate": "2026-09-09T08:21:14.392Z",
            "updatedDate": "2026-09-09T08:21:14.392Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "8af4a636-cefc-4b6c-a49d-bdf371e26a5f",
            "name": "Retail-1788942125898",
            "code": "C2125898",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T08:22:07.102Z",
            "updatedDate": "2026-09-09T08:22:10.867Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "8687db77-d69a-40a3-8e5e-2c4194e791b5",
            "name": "Retail-1788942194048",
            "code": "C2194048",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T08:23:14.920Z",
            "updatedDate": "2026-09-09T08:23:17.766Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "d8efc6c6-3c52-4372-904c-016c7df16b85",
            "name": "Retail-1788943234420",
            "code": "C3234420",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T08:40:35.263Z",
            "updatedDate": "2026-09-09T08:40:37.638Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "ad640afc-0db1-4a31-928e-b4ea33fa2663",
            "name": "Retail-1788947197225",
            "code": "C7197225",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T09:46:37.922Z",
            "updatedDate": "2026-09-09T09:46:41.646Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "7cd0d830-35a3-4b6d-8fe4-e4f0c69d78be",
            "name": "Retail-1788947473210",
            "code": "C7473210",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T09:51:14.266Z",
            "updatedDate": "2026-09-09T09:51:17.753Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "9a42a567-2223-409c-9120-20c6eda9fb7f",
            "name": "Retail-1788971983107",
            "code": "C1983107",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T16:39:43.372Z",
            "updatedDate": "2026-09-09T16:39:44.496Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "100f9572-9c76-4d20-a649-479660e0cde4",
            "name": "Retail-1788973269188",
            "code": "C3269188",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T17:01:09.462Z",
            "updatedDate": "2026-09-09T17:01:10.251Z",
            "linkedMerchantCount": 1
        },
        {
            "id": "847cdc0b-c646-4cfd-a9e6-ec0e72d9ce56",
            "name": "Retail-1788973295599",
            "code": "C3295599",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T17:01:35.885Z",
            "updatedDate": "2026-09-09T17:01:36.625Z",
            "linkedMerchantCount": 1
        },
        {
            "id": "90592859-263e-4b98-a620-201eae7521cd",
            "name": "Retail-1788973328574",
            "code": "C3328574",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T17:02:08.845Z",
            "updatedDate": "2026-09-09T17:02:09.590Z",
            "linkedMerchantCount": 1
        },
        {
            "id": "83c7f378-0184-4ae5-9a95-ece856aec6c0",
            "name": "Retail-1788973370878",
            "code": "C3370878",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T17:02:51.257Z",
            "updatedDate": "2026-09-09T17:02:52.570Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "e29e9eb2-60d3-454c-b48f-8c06f4af9083",
            "name": "Retail-1788973827600",
            "code": "C3827600",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-09T17:10:28.261Z",
            "updatedDate": "2026-09-09T17:10:31.217Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "92b9f454-3b6d-4bcc-8a32-22e481c3bf07",
            "name": "Retail-1789001185989",
            "code": "C1185989",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-10T00:46:26.370Z",
            "updatedDate": "2026-09-10T00:46:27.873Z",
            "linkedMerchantCount": 4
        },
        {
            "id": "a53dc327-94c1-426e-bb6f-895b4cf6821f",
            "name": "Retail-1789001208707",
            "code": "C1208707",
            "description": "Retail shops",
            "defaultTaxPolicy": "VAT 15%",
            "status": "ACTIVE",
            "createdDate": "2026-09-10T00:46:49.100Z",
            "updatedDate": "2026-09-10T00:46:50.567Z",
            "linkedMerchantCount": 5
        }
    ];

export function AddMerchantModal({
  isOpen,
  onClose,
  onAddMerchant,
}: AddMerchantModalProps) {
  const dispatch = useAppDispatch();

  // Empty initial states to reveal field placeholders
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  console.log("category",category)
  const [tinNumber, setTinNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [managerIdFile, setManagerIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setCategory(CATEGORIES[0].id);
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
      formData.append("categoryId", category);
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
        // Fallback fallback object formatting if backend returns basic payload
        const createdMerchant: Merchant = response.data || {
          id: response.data?.id || `mch-${Date.now()}`,
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
            title: "",
            message: "Unable to create merchant account. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());

      const status = error?.response?.status;
      let errorMessage = "An error occurred while connecting to MerchantService.";

      if (status === 404) {
        errorMessage =
          "The merchant onboarding endpoint was not found on the server. Please verify the API route configuration.";
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
          {/* Row 1: Merchant Name & Category */}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
            disabled={isSubmitting}
            required
          />

          {/* Business License Upload Area */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              BUSINESS LICENSE UPLOAD <span className="text-rose-500">*</span>
            </label>
            <label className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-900/40 p-5 text-center transition-colors hover:border-indigo-400 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
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

          {/* Row 3: Manager Name & Contact Phone */}
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

          {/* Row 4: Password Field */}
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
              <label className={`cursor-pointer ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
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
              disabled={isSubmitting || !name || !tinNumber || !managerName || !contactPhone || !password}
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