import axios from 'axios';

// 1. Standard Pagination Interface
export interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// 2. Generic API Response Wrapper (pagination made OPTIONAL via ?)
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  pagination?: PaginationInfo; // Optional because not all endpoints have pagination
}

// 3. Module Augmentation: Override Axios return types globally
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any, R = ApiResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = ApiResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    patch<T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  }
}