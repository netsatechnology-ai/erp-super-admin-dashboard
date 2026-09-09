import apiClient from "@/lib/apiClient";

export class UserService {
  static async addRole(data: any) {
    return apiClient.post("/admin/user/addRole", data);
  }
  static async addUser(data: any) {
    return apiClient.post("/admin/user/addUser", data);
  }


}
