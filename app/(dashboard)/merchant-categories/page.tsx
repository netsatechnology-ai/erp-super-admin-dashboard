"use client";

import React, { useEffect, useState, useCallback } from "react";
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

 
  const [filter, setFilter] = useState({
    search: "",
    currentPage: 1,
    pageSize: 10,
    status: "",
    totalPages:0,
    totalItems:0
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await MerchantService.fetchCatagories(filter);
      if (response.status) {
        setCategories(response.data);
        if(filter.currentPage==1){
          setFilter({...filter, 
            totalPages:response.pagination?.totalPages || 0,
            totalItems:response.pagination?.totalItems || 0
          })
        }
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
  }, [filter, dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [filter.currentPage]);

  const handleFilterChange = (newFilters:any) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 whenever search query or status changes
      ...(newFilters.currentPage === undefined && { currentPage: 1 }),
    }));
  };

  const handleAddClick = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSelectCategory = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = () => {
    // Re-fetch from backend to get fresh paginated/filtered dataset
    fetchCategories();
    setSelectedCategory(null);
  };

  const handleToggleStatus = (
    categoryId: string,
    nextStatus: "ACTIVE" | "INACTIVE"
  ) => {
    setCategories((prev) => {
      if (!prev) return null;
      return prev.map((cat) =>
        cat.id === categoryId ? { ...cat, status: nextStatus } : cat
      );
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Re-fetch from backend to keep exact pagination counts intact
    fetchCategories();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <CategoryHeader onAddClick={handleAddClick} />
      <CategoryKpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <CategoryTable
            categories={categories}
            selectedCategoryId={selectedCategory?.id || null}
            onSelectCategory={handleSelectCategory}
            onToggleStatus={handleToggleStatus}
            onDeleteCategory={handleDeleteCategory}
            filter={filter}
            setFilter={setFilter}
            onFilterChange={handleFilterChange}
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