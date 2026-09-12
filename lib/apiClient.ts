import axios, { AxiosRequestConfig } from 'axios';

// 1. Pagination structure
export interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// 2. Generic API Response Wrapper with optional pagination
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  pagination?: PaginationInfo;
}

// 3. Override Axios return types directly in this file
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any, R = ApiResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = ApiResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    patch<T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  }
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'API Request Failed';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;