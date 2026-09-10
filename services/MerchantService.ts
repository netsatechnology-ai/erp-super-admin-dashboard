import apiClient from "@/lib/apiClient";

export class MerchantService {
  static async addMerchant(data: any) {
    return apiClient.post("/api/v1/merchants", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async fetchCatagories(search: string) {
    return apiClient.get(`/api/v1/merchants/categories?search=${search}`,{headers: { 'ngrok-skip-browser-warning': 'true' }}
     
    );
  }
  static async updateCategory(id: string, data: any) {
    return apiClient.patch(`/api/v1/merchants/categories/${id}`, data);
  }
  static async addCategory(data: any) {
    return apiClient.post("/api/v1/merchants/categories", data);
  }
    static async fetchMerchants(search: string) {
    return apiClient.get(`/api/v1/merchants?search=${search}`);
  }
}
