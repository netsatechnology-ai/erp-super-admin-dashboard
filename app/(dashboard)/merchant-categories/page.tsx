"use client";

import React, { useState } from "react";
import { CategoryItem } from "./types";
import { CategoryHeader } from "./_components/CategoryHeader";
import { CategoryKpiCards } from "./_components/CategoryKpiCards";
import { CategoryTable } from "./_components/CategoryTable";
import { CategoryForm } from "./_components/CategoryForm";
import { CategorySectorChart } from "./_components/CategorySectorChart";
import { RegulatoryBanner } from "./_components/RegulatoryBanner";

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Retail & Supermarket", code: "RTL", description: "Supermarket and retail operations...", linkedMerchants: 164, taxRule: "VAT 15%", status: "ACTIVE" },
  { id: "cat-2", name: "Food & Beverage", code: "FNB", description: "Restaurants, cafes and eateries...", linkedMerchants: 142, taxRule: "VAT 15% + SC 10%", status: "ACTIVE" },
  { id: "cat-3", name: "Health & Pharmacy", code: "HLT", description: "Pharmacies and health centers...", linkedMerchants: 45, taxRule: "Standard Exempt", status: "ACTIVE" },
  { id: "cat-4", name: "Hospitality & Lodging", code: "HSP", description: "Hotels, guest houses and lodges...", linkedMerchants: 38, taxRule: "VAT 15% + SC 10%", status: "ACTIVE" },
  { id: "cat-5", name: "Automotive & Hardware", code: "AUT", description: "Auto repair and hardware stores...", linkedMerchants: 27, taxRule: "VAT 15%", status: "ACTIVE" },
  { id: "cat-6", name: "Digital & Telecomm", code: "DGT", description: "SaaS, cloud and telco operations...", linkedMerchants: 12, taxRule: "VAT 15%", status: "ACTIVE" },
  { id: "cat-7", name: "Nightlife & Entertainment", code: "ENT", description: "Clubs, event spaces and venues...", linkedMerchants: 0, taxRule: "VAT 15% + SC 10%", status: "DEACTIVATED" },
  { id: "cat-8", name: "Precious Minerals & Jewelry", code: "JWL", description: "Bullion and jewelry retailers...", linkedMerchants: 0, taxRule: "VAT 15%", status: "DEACTIVATED" },
];

export default function MerchantCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  const handleAddClick = () => {
    setSelectedCategory(null);
    document.getElementById("category-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectCategory = (category: CategoryItem) => {
    setSelectedCategory(category);
    document.getElementById("category-form")?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div className="space-y-6 pb-10">
      <CategoryHeader onAddClick={handleAddClick} />
      <CategoryKpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <CategoryTable
            categories={categories}
            selectedCategoryId={selectedCategory?.id || null}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CategoryForm
            selectedCategory={selectedCategory}
            onSaveCategory={handleSaveCategory}
            onClearSelection={() => setSelectedCategory(null)}
          />
          <CategorySectorChart />
        </div>
      </div>

      <RegulatoryBanner />
    </div>
  );
}