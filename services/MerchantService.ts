import apiClient from "@/lib/apiClient";

export class MerchantService {
  static async addMerchant(data: any) {
    return apiClient.post("/api/v1/merchants", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async updateMerchant(data: any, id:string) {
    return apiClient.patch(`/api/v1/merchants/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async deleteMerchant( id:string) {
    return apiClient.delete(`/api/v1/merchants/${id}`,  {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async fetchCatagories(filter: any) {
    return apiClient.get(
      `/api/v1/merchants/categories?search=${filter.search}&pageSize=${filter.pageSize}&page=${filter.currentPage}`,
      { headers: { "ngrok-skip-browser-warning": "true" } },
    );
  }
  static async fetchCatagoriesForDropDown() {
    return apiClient.get(
      `/api/v1/merchants/categories`,
      { headers: { "ngrok-skip-browser-warning": "true" } },
    );
  }
  static async updateCategory(id: string, data: any) {
    return apiClient.patch(`/api/v1/merchants/categories/${id}`, data);
  }
  static async deleteCategory(id: string) {
    return apiClient.delete(`/api/v1/merchants/categories/${id}`);
  }
  static async addCategory(data: any) {
    return apiClient.post("/api/v1/merchants/categories", data);
  }
  static async fetchMerchants(filter:any) {
    return apiClient.get(`/api/v1/merchants?search=${filter.search}&pageSize=${filter.pageSize}&page=${filter.currentPage}`);
  }
}
