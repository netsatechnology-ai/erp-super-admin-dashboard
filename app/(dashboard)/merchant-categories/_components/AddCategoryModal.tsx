"use client";

import React, { useState, useEffect } from "react";
import { X, RotateCcw, Save, Edit2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/CustomInput";
import { CategoryItem } from "../types";
import { MerchantService } from "@/services/MerchantService";
import { hideLoader, showLoader } from "@/lib/redux/slices/loadingSlice";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryItem | null;
  onSaveCategory: (category: CategoryItem) => void;
  onClearSelection: () => void;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  selectedCategory,
  onSaveCategory,
  onClearSelection,
}: AddCategoryModalProps) {
  const dispatch = useDispatch();

  const [catName, setCatName] = useState("");
  const [catCode, setCatCode] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [taxPolicy, setTaxPolicy] = useState("VAT 15% (Standard Output)");

  const [isSubmitting, setIsSubmitting] = useState(false);
console.log("oooooooo",selectedCategory)
  useEffect(() => {
    if (selectedCategory) {
      setCatName(selectedCategory.name);
      setCatCode(selectedCategory.code);
      setCatDescription(selectedCategory.description);
      setTaxPolicy(
        selectedCategory.defaultTaxPolicy?.includes("SC 10%")
          ? "VAT 15% + SC 10%"
          : selectedCategory.defaultTaxPolicy?.includes("Exempt")
          ? "Standard Exempt"
          : "VAT 15% (Standard Output)"
      );

    } else {
      resetFormFields();
    }
  }, [selectedCategory, isOpen]);

  const resetFormFields = () => {
    setCatName("");
    setCatCode("");
    setCatDescription("");
    setTaxPolicy("VAT 15% (Standard Output)");
  
  };

  const handleResetForm = () => {
    resetFormFields();
    onClearSelection();
  };

  const handleModalClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!catName || !catCode) return;

    setIsSubmitting(true);
    dispatch(
      showLoader(
        selectedCategory ? "Updating category..." : "Creating category..."
      )
    );

    const mappedTaxRule = taxPolicy.includes("SC 10%")
      ? "VAT 15% + SC 10%"
      : taxPolicy.includes("Exempt")
      ? "Standard Exempt"
      : "VAT 15%";

    const payload = {
      name: catName,
      code: catCode.toUpperCase(),
      description: catDescription || "New sector...",
      defaultTaxPolicy: mappedTaxRule,
    };

    const updatePayload = {
      code: catCode.toUpperCase(),
      description: catDescription || "New sector...",
      defaultTaxPolicy: mappedTaxRule,
    };

    try {
      let response: any;

      if (selectedCategory) {
        response = await MerchantService.updateCategory(
          selectedCategory.id,
          updatePayload
        );
      } else {
        response = await MerchantService.addCategory(payload);
      }

      dispatch(hideLoader());

      if (response) {
        const savedCategory: CategoryItem = response.category || {
          id: selectedCategory?.id || response.id || `cat-${Date.now()}`,
          linkedMerchantCount: selectedCategory?.linkedMerchantCount || 0,...selectedCategory,
          ...payload,
        };

        onSaveCategory(savedCategory);
        handleModalClose();

        dispatch(
          showResponseModal({
            status: "success",
            title: selectedCategory ? "Category Updated" : "Category Created",
            message: `Category "${savedCategory.name}" (${savedCategory.code}) has been successfully saved.`,
            buttonText: "Done",
          })
        );
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            title: "Operation Failed",
            message: "Unable to process category request. Please try again.",
            buttonText: "Try Again",
          })
        );
      }
    } catch (error: any) {
      dispatch(hideLoader());
      dispatch(
        showResponseModal({
          status: "error",
          title: "Category Error",
          message:
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred while connecting to MerchantService.",
          buttonText: "Close",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-border/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-foreground">
                {selectedCategory ? "Update Category" : "Add Category"}
              </h2>
              {selectedCategory && (
                <span className="rounded-md bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Edit2 className="h-3 w-3" /> Editing #{selectedCategory.code}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Configure sector classification details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              title="Reset form"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleModalClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            label="CATEGORY NAME"
            requiredStar
            placeholder="e.g. Food & Beverage"
            value={catName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCatName(e.target.value)
            }
            required
            disabled={isSubmitting}
          />

          <CustomInput
            label="CATEGORY CODE"
            requiredStar
            topRightBadge={
              <span className="text-[10px] font-medium text-muted-foreground">
                3 Uppercase Letters
              </span>
            }
            placeholder="FNB"
            className="font-mono uppercase font-bold"
            value={catCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCatCode(e.target.value)
            }
            maxLength={3}
            required
            disabled={isSubmitting}
          />

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              placeholder="Brief overview of included merchant operations..."
              value={catDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setCatDescription(e.target.value)
              }
              disabled={isSubmitting}
              className="w-full rounded-xl border border-transparent bg-indigo-50/50 dark:bg-slate-900/60 p-3 text-xs font-semibold text-foreground focus:border-indigo-500 focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-muted-foreground/60 resize-none disabled:opacity-50"
            />
          </div>

          <CustomInput
            label="DEFAULT TAX POLICY"
            requiredStar
            as="select"
            value={taxPolicy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
              setTaxPolicy(e.target.value)
            }
            disabled={isSubmitting}
          >
            <option value="VAT 15% (Standard Output)">
              VAT 15% (Standard Output)
            </option>
            <option value="VAT 15% + SC 10%">
              VAT 15% + Service Charge 10%
            </option>
            <option value="Standard Exempt">Standard Exempt</option>
          </CustomInput>

          {/* <div className="flex items-center justify-between rounded-xl bg-indigo-50/40 dark:bg-slate-900/40 p-3 border border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">
                Category Status
              </p>
              <p className="text-[10px] text-muted-foreground">
                Enabled for new merchants
              </p>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsCategoryEnabled(!isCategoryEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
                isCategoryEnabled
                  ? "bg-indigo-600"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  isCategoryEnabled ? "translate-x-5" : "translate-x-0.5"
                } my-0.5`}
              />
            </button>
          </div> */}

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleModalClose}
              className="flex-1 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>
                {selectedCategory ? "Update Category" : "Save Category"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}