import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { APIResponse, Product, ReturnProcess, MLAnalysisResult, ReturnReason } from '../types';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://sr-product-server-ul9j.onrender.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Implement token retrieval logic
    return null;
  }

  // Product APIs
  async scanProduct(barcode: string): Promise<APIResponse<Product>> {
    const response = await this.client.post('/scan', { barcode });
    return response.data;
  }

  async getProductDetails(productId: string): Promise<APIResponse<Product>> {
    const response = await this.client.get(`/products/${productId}`);
    return response.data;
  }

  // Return Process APIs
  async initiateReturn(productId: string, reasonId: string): Promise<APIResponse<ReturnProcess>> {
    const response = await this.client.post('/returns/initiate', {
      productId,
      reasonId,
    });
    return response.data;
  }

  async uploadPhoto(returnId: string, photo: FormData): Promise<APIResponse<{ uploadId: string }>> {
    const response = await this.client.post(`/returns/${returnId}/photos`, photo, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async submitForAnalysis(returnId: string): Promise<APIResponse<MLAnalysisResult>> {
    const response = await this.client.post(`/returns/${returnId}/analyze`);
    return response.data;
  }

  async getReturnStatus(returnId: string): Promise<APIResponse<ReturnProcess>> {
    const response = await this.client.get(`/returns/${returnId}`);
    return response.data;
  }

  // Return Reasons
  async getReturnReasons(): Promise<APIResponse<ReturnReason[]>> {
    const response = await this.client.get('/returns/reasons');
    return response.data;
  }

  // ML Analysis
  async getAnalysisResults(returnId: string): Promise<APIResponse<MLAnalysisResult>> {
    const response = await this.client.get(`/returns/${returnId}/analysis`);
    return response.data;
  }

  async approveReturn(returnId: string): Promise<APIResponse<{ refundAmount: number }>> {
    const response = await this.client.post(`/returns/${returnId}/approve`);
    return response.data;
  }

  async rejectReturn(returnId: string, reason: string): Promise<APIResponse<void>> {
    const response = await this.client.post(`/returns/${returnId}/reject`, { reason });
    return response.data;
  }

  // User APIs
  async getUserReturns(userId: string): Promise<APIResponse<ReturnProcess[]>> {
    const response = await this.client.get(`/users/${userId}/returns`);
    return response.data;
  }
}

export const apiClient = new APIClient();
export default apiClient;