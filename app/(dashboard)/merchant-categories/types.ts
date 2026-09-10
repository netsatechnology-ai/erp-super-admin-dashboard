export interface CategoryItem {
  id: string;
  name: string;
  code: string;
  description: string;
  linkedMerchantCount: number;
  defaultTaxPolicy: string;
  status: "ACTIVE" | "INACTIVE";
  createdDate?:string ,
  updatedDate?:string ,
}