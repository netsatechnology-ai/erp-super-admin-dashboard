export type MerchantStatus = "APPROVED" | "COMPLETE" | "INCOMPLETE";

export interface Merchant {
id: string;
tin: string;
categoryId: string;
managerFullName: string;
managerPhoneNumber: string;

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