import apiClient from "@/lib/apiClient";

export class RoleService {
  static async fetchPermissions() {
    return apiClient.get("/api/v1/permissions");
  }
  static async fetchRoles(filter:any) {
    return apiClient.get(`/api/v1/roles?search=${filter.search}&pageSize=${filter.pageSize}&page=${filter.currentPage}`);
  }
  static async updateRoleDescription(id:string, data:any) {
    return apiClient.patch(`/api/v1/roles/${id}`, data);
  }
  static async assignPermissionsToRole(id:string, data:any) {
    return apiClient.put(`api/v1/roles/${id}/permissions`, data);
  }
  static async updateRoleStatus(id:string, data:any) {
     return apiClient.patch(`/api/v1/roles/${id}`, data);
  }



   static async addRole(data: any) {
    return apiClient.post("/api/v1/roles", data);
  }

 


}
