import { apiClient } from './apiClient'
import { CategoryService, ProductService } from '../types'
import { CategoriesResponse, ProductsResponse, ProductDetailsResponse } from '../types'

export const adminService = {
  // ============ CATEGORY MANAGEMENT ============

  // Create category with image (multipart form data)
  createCategory: async (formData: FormData): Promise<CategoriesResponse> => {
    return apiClient.request<CategoriesResponse>('/Category/createCategory', {
      method: 'POST',
      body: formData,
    })
  },

  // Update category
  updateCategory: async (id: number, formData: FormData): Promise<CategoriesResponse> => {
    return apiClient.request<CategoriesResponse>(`/Category/editCategory/${id}`, {
      method: 'PUT',
      body: formData,
    })
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/Category/deleteCategory/${id}`)
  },

  // ============ PRODUCT MANAGEMENT ============

  // Create product with image (multipart form data)
  createProduct: async (formData: FormData): Promise<ProductDetailsResponse> => {
    return apiClient.request<ProductDetailsResponse>('/Product/createProduct', {
      method: 'POST',
      body: formData,
    })
  },

  // Update product
  updateProduct: async (id: number, formData: FormData): Promise<ProductDetailsResponse> => {
    return apiClient.request<ProductDetailsResponse>(`/Product/editProduct/${id}`, {
      method: 'PUT',
      body: formData,
    })
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/Product/deleteProduct/${id}`)
  },

  // ============ ORDER MANAGEMENT ============

  // Get all orders
  getAllOrders: async () => {
    return apiClient.get('/Order/getAllOrder')
  },

  // ============ STATS & ANALYTICS ============

  // Get order statistics
  getOrderStats: async () => {
    return apiClient.get('/Order/admin/stats')
  },
}
