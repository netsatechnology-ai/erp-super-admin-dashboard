import apiClient from '@/lib/apiClient';


export class MerchantService {
    static async addMerchant(data: any) {
        return apiClient.post('/admin/merchant/addMerchant', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },});
    }
  


}