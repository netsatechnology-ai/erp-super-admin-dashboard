import apiClient from "@/lib/apiClient";

export class MerchantService {
  static async addMerchant(data: any) {
    return apiClient.post("/admin/merchant/addMerchant", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async fetchCatagories(search: string) {
    return apiClient.get(`/api/v1/merchants/categories?search=${search}`);
  }
  static async updateCategory(id: string, data: any) {
    return apiClient.patch(`/api/v1/merchants/categories/${id}`, data);
  }
  static async addCategory(data: any) {
    return apiClient.post("/api/v1/merchants/categories", data);
  }
}
