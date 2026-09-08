export interface CategoryItem {
  id: string;
  name: string;
  code: string;
  description: string;
  linkedMerchants: number;
  taxRule: string;
  status: "ACTIVE" | "DEACTIVATED";
}