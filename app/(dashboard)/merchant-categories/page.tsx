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

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Retail & Supermarket", code: "RTL", description: "Supermarket and retail operations...", linkedMerchantCount: 164, defaultTaxPolicy: "VAT 15%", status: "ACTIVE" },
  { id: "cat-2", name: "Food & Beverage", code: "FNB", description: "Restaurants, cafes and eateries...", linkedMerchantCount: 142, defaultTaxPolicy: "VAT 15% + SC 10%", status: "ACTIVE" },
  { id: "cat-3", name: "Health & Pharmacy", code: "HLT", description: "Pharmacies and health centers...", linkedMerchantCount: 45, defaultTaxPolicy: "Standard Exempt", status: "ACTIVE" },
  { id: "cat-4", name: "Hospitality & Lodging", code: "HSP", description: "Hotels, guest houses and lodges...", linkedMerchantCount: 38, defaultTaxPolicy: "VAT 15% + SC 10%", status: "ACTIVE" },
  { id: "cat-5", name: "Automotive & Hardware", code: "AUT", description: "Auto repair and hardware stores...", linkedMerchantCount: 27, defaultTaxPolicy: "VAT 15%", status: "ACTIVE" },
  { id: "cat-6", name: "Digital & Telecomm", code: "DGT", description: "SaaS, cloud and telco operations...", linkedMerchantCount: 12, defaultTaxPolicy: "VAT 15%", status: "ACTIVE" },
  { id: "cat-7", name: "Nightlife & Entertainment", code: "ENT", description: "Clubs, event spaces and venues...", linkedMerchantCount: 0, defaultTaxPolicy: "VAT 15% + SC 10%", status: "DEACTIVATED" },
  { id: "cat-8", name: "Precious Minerals & Jewelry", code: "JWL", description: "Bullion and jewelry retailers...", linkedMerchantCount: 0, defaultTaxPolicy: "VAT 15%", status: "DEACTIVATED" },
];

export default function MerchantCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const fetchCatagories=()=>{
  try{
MerchantService.fetchCatagories("").then((response)=>{
  if(response){
    console.log("tzzzzz",response)
  }
})
  }catch (error) {

  }
}
useEffect(()=>{
fetchCatagories()
},[])
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
      const exists = prev.some((c) => c.id === categoryToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === categoryToSave.id ? categoryToSave : c));
      }
      return [categoryToSave, ...prev];
    });
    setSelectedCategory(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <CategoryHeader onAddClick={handleAddClick} />
      <CategoryKpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table taking 8 cols and chart taking 4 cols */}
        <div className="lg:col-span-8">
          <CategoryTable
            categories={categories}
            selectedCategoryId={selectedCategory?.id || null}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        <div className="lg:col-span-4">
          <CategorySectorChart />
        </div>
      </div>

      <RegulatoryBanner />

      {/* Category Modal Dialog */}
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