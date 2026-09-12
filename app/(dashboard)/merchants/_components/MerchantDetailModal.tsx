"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { 
  X, 
  Store, 
  FileBadge, 
  User, 
  Save,
  Building,
  Phone,
  FileText,
  UserCheck,
  Calendar,
  Loader2,
  FolderTree,
  Eye,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Merchant, MerchantStatus } from "../types";
import { CustomInput } from "@/components/ui/CustomInput";
import { MerchantService } from "@/services/MerchantService";
import { useAppDispatch } from "@/lib/redux/store";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { CategoryItem } from "../../merchant-categories/types";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";

interface FormMerchant extends Merchant {
  businessLicense?: string;
  managerId?: string;
  categoryName?: string;
  createdDate?: string;
}

interface MerchantDetailModalProps {
  isOpen: boolean;
  merchant: Merchant | null;
  onClose: () => void;
  onUpdateMerchant: (updated: Merchant) => void;
  
  onDeleteMerchant?: (merchantId: string | number) => Promise<void> | void;
}

export function MerchantDetailModal({
  isOpen,
  merchant,
  onClose,
  onUpdateMerchant,
  onDeleteMerchant,
}: MerchantDetailModalProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormMerchant | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // File Preview Modal State
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    fileUrl: string | null;
    fileName: string;
  }>({
    isOpen: false,
    fileUrl: null,
    fileName: "",
  });

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await MerchantService.fetchCatagoriesForDropDown();
      if (response?.status && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error: any) {
      dispatch(
        showResponseModal({
          status: "error",
          message: error.message || "Failed to load merchant categories",
          buttonText: "Try Again",
        })
      );
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setConfirmDelete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (merchant) {
      const raw = merchant as Record<string, any>;
      setFormData({
        ...merchant,
        name: merchant.name || "",
        categoryName: raw.categoryName || raw.category || "",
        category: raw.category || raw.categoryId || "",
        categoryId: raw.categoryId || raw.category || "",
        tin: raw.tin || raw.tinNumber || "",
        tinNumber: raw.tinNumber || raw.tin || "",
        managerFullName: raw.managerFullName || raw.managerName || "",
        managerName: raw.managerName || raw.managerFullName || "",
        managerPhoneNumber: raw.managerPhoneNumber || raw.contactPhone || "",
        contactPhone: raw.contactPhone || raw.managerPhoneNumber || "",
        businessLicense: raw.businessLicense || raw.licenseFile || "",
        licenseFile: raw.licenseFile || raw.businessLicense || "",
        managerId: raw.managerId || raw.managerIdFile || "",
        managerIdFile: raw.managerIdFile || raw.managerId || "",
        createdAt: merchant.createdAt || raw.createdDate || "",
      });
    } else {
      setFormData(null);
    }
  }, [merchant]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (formData) {
      onUpdateMerchant(formData as Merchant);
      onClose();
    }
  };

  const handleExecuteDelete = async () => {
    if (!formData?.id || !onDeleteMerchant) return;

    try {
      setIsDeleting(true);
      await onDeleteMerchant(formData.id);
      setConfirmDelete(false);
      onClose();
    } catch (error: any) {
      dispatch(
        showResponseModal({
          status: "error",
          message: error.message || "Failed to delete merchant",
          buttonText: "Dismiss",
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenPreview = (fileUrl?: string, fileName?: string) => {
    if (!fileUrl) return;
    setPreviewState({
      isOpen: true,
      fileUrl,
      fileName: fileName || "Document Preview",
    });
  };

  const businessLicenseUrl = formData.businessLicense || formData.licenseFile;
  const managerIdUrl = formData.managerId || formData.managerIdFile;

  return (
    <>
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
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Status Badge Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Verification & Clearance Status
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  Update account clearance state for operational access.
                </p>
              </div>

              <CustomInput
                as="select"
                value={formData.status || "APPROVED"}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  if (!formData) return;
                  setFormData({ ...formData, status: e.target.value as MerchantStatus });
                }}
                containerClassName="sm:w-48 space-y-0"
                className="rounded-xl bg-background font-extrabold focus:ring-indigo-500/20"
              >
               
           
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                     {/* <option value="APPROVED">APPROVED</option>
                <option value="COMPLETE">COMPLETE</option>
                <option value="INCOMPLETE">INCOMPLETE PROFILE</option> */}
              </CustomInput>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                label="Merchant Business Name"
                leftIcon={<Building className="h-4 w-4" />}
                value={formData.name || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!formData) return;
                  setFormData({ ...formData, name: e.target.value });
                }}
                className="rounded-xl text-xs font-bold"
              />

              <CustomInput
                label="Merchant Category"
                as="select"
                leftIcon={
                  isCategoriesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <FolderTree className="h-4 w-4" />
                  )
                }
                value={formData.categoryId || formData.category || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  if (!formData) return;
                  const selectedCat = categories.find(
                    (c) => String(c.id) === e.target.value
                  );
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    category: selectedCat?.name || e.target.value,
                    categoryName: selectedCat?.name || e.target.value,
                  });
                }}
                disabled={isCategoriesLoading || categories.length === 0}
                className="rounded-xl text-xs font-semibold"
              >
                {isCategoriesLoading ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : categories.length === 0 ? (
                  <option value="" disabled>
                    No categories available
                  </option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </CustomInput>

              <CustomInput
                label="TIN Number"
                leftIcon={<FileText className="h-4 w-4" />}
                value={formData.tin || formData.tinNumber || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!formData) return;
                  setFormData({
                    ...formData,
                    tin: e.target.value,
                    tinNumber: e.target.value,
                  });
                }}
                className="rounded-xl text-xs font-mono font-bold"
              />

              <CustomInput
                label="Assigned Manager"
                leftIcon={<UserCheck className="h-4 w-4" />}
                value={formData.managerFullName || formData.managerName || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!formData) return;
                  setFormData({
                    ...formData,
                    managerFullName: e.target.value,
                    managerName: e.target.value,
                  });
                }}
                className="rounded-xl text-xs font-bold"
              />

              <CustomInput
                label="Manager Phone"
                leftIcon={<Phone className="h-4 w-4" />}
                value={formData.managerPhoneNumber || formData.contactPhone || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!formData) return;
                  setFormData({
                    ...formData,
                    managerPhoneNumber: e.target.value,
                    contactPhone: e.target.value,
                  });
                }}
                className="rounded-xl text-xs font-semibold"
              />

              <CustomInput
                label="Registration Date"
                leftIcon={<Calendar className="h-4 w-4" />}
                disabled
                value={formData.createdAt || formData.createdDate || ""}
                className="rounded-xl text-xs font-mono bg-muted/50 text-muted-foreground"
              />
            </div>

            {/* Documents Section */}
            <div className="border-t border-border/80 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Attached Compliance Verification Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Business License Card */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <FileBadge className="h-4 w-4 shrink-0 text-indigo-600" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {businessLicenseUrl ? "Trade_License.pdf" : "No License Attached"}
                    </span>
                  </div>
                  {businessLicenseUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleOpenPreview(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL}${businessLicenseUrl}`,
                          "Trade License Document"
                        )
                      }
                      className="h-7 px-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg shrink-0 gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 shrink-0">
                      MISSING
                    </span>
                  )}
                </div>

                {/* Manager ID Card */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <User className="h-4 w-4 shrink-0 text-indigo-600" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {managerIdUrl ? "Manager_National_ID.pdf" : "No ID Attached"}
                    </span>
                  </div>
                  {managerIdUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleOpenPreview(managerIdUrl, "Manager National ID")
                      }
                      className="h-7 px-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg shrink-0 gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 shrink-0">
                      MISSING
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-border/80">
              {onDeleteMerchant ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setConfirmDelete(true)}
                  className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 rounded-xl shadow-xs cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Merchant</span>
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-5 text-xs font-bold text-muted-foreground rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 rounded-xl shadow-xs cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-full bg-rose-100 dark:bg-rose-950/50 p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">Confirm Deletion</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{formData.name || "this merchant"}</strong>? All associated records and details will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setConfirmDelete(false)}
                className="px-4 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 rounded-xl shadow-xs cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Confirm Delete</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewState.isOpen}
        onClose={() => setPreviewState((prev) => ({ ...prev, isOpen: false }))}
        fileUrl={previewState.fileUrl}
        fileName={previewState.fileName}
      />
    </>
  );
}