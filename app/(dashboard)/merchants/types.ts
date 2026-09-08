export type MerchantStatus = "APPROVED" | "COMPLETE" | "INCOMPLETE";

export interface Merchant {
  id: string;
  name: string;
  category: string;
  tinNumber: string;
  managerName: string;
  contactPhone: string;
  status: MerchantStatus;
  licenseFile?: string;
  managerIdFile?: string;
  createdAt: string;
  outletsCount?: number;
}