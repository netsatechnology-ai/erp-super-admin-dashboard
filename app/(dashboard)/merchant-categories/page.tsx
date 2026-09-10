"use client";

import React, { useEffect, useState } from "react";
import { CategoryItem } from "./types";
import { CategoryHeader } from "./_components/CategoryHeader";
import { CategoryKpiCards } from "./_components/CategoryKpiCards";
import { CategoryTable } from "./_components/CategoryTable";
import { AddCategoryModal } from "./_components/AddCategoryModal";
import { CategorySectorChart } from "./_components/CategorySectorChart";
import { RegulatoryBanner } from "./_components/RegulatoryBanner";
import { MerchantService } from "@/services/MerchantService";
import { showResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { useAppDispatch } from "@/lib/redux/store";

export default function MerchantCategoriesPage() {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<CategoryItem[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await MerchantService.fetchCatagories("");
      if (response.categories) {
        setCategories(response.categories);
      } else {
        dispatch(
          showResponseModal({
            status: "error",
            message: "Failed to get category list",
            buttonText: "Try Again",
          })
        );
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
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSelectCategory = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (categoryToSave: CategoryItem) => {
    setCategories((prev) => {
      if (!prev) return [categoryToSave];
      const exists = prev.some((c) => c.id === categoryToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === categoryToSave.id ? categoryToSave : c));
      }
      return [categoryToSave, ...prev];
    });
    setSelectedCategory(null);
  };

  const handleToggleStatus = (categoryId: string, nextStatus: "ACTIVE" | "INACTIVE") => {
    setCategories((prev) => {
      if (!prev) return null;
      return prev.map((cat) =>
        cat.id === categoryId ? { ...cat, status: nextStatus } : cat
      );
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <CategoryHeader onAddClick={handleAddClick} />
      <CategoryKpiCards />

      <div>
        <div className="lg:col-span-8">
          <CategoryTable
            categories={categories}
            selectedCategoryId={selectedCategory?.id || null}
            onSelectCategory={handleSelectCategory}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        <div className="lg:col-span-4">
          <CategorySectorChart />
        </div>
      </div>

      <RegulatoryBanner />

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedCategory={selectedCategory}
        onSaveCategory={handleSaveCategory}
        onClearSelection={() => setSelectedCategory(null)}
      />
    </div>
  );
}