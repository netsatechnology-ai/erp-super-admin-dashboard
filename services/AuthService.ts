import apiClient from '@/lib/apiClient';


export class AuthService {
    static async logIn(data: any) {
        return apiClient.post('/admin/auth/login', data);
    }
    static async sendForgetOtp(data: any) {
        return apiClient.post('/admin/auth/forgetotp/send', data);
    }
    static async verifyOtp(data: any) {
        return apiClient.post('/admin/auth/forgetotp/verify', data);
    }
    static async resetPassword(data: any) {
        return apiClient.post('/admin/auth/resetPassword', data);
    }


}