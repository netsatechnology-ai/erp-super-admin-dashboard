import apiClient from "@/lib/apiClient";

export class MerchantService {
  static async addMerchant(data: any) {
    return apiClient.post("/admin/merchant/addMerchant", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async updateCategory(id: string, data: any) {
    return apiClient.patch(`/admin/merchant/updateCatagory/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async addCategory(data: any) {
    return apiClient.patch("/admin/merchant/addCatagory", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
