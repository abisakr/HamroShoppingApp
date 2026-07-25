import { apiClient } from './apiClient'
import { CategoriesResponse } from '../types'

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<CategoriesResponse> => {
    return apiClient.get<CategoriesResponse>('/Category/getAllCategory')
  },

  // Admin: Create category (multipart form data with image)
  createCategory: async (formData: FormData): Promise<CategoriesResponse> => {
    return apiClient.request<CategoriesResponse>('/Category/createCategory', {
      method: 'POST',
      body: formData,
    })
  },

  // Admin: Update category
  updateCategory: async (id: number, formData: FormData): Promise<CategoriesResponse> => {
    return apiClient.request<CategoriesResponse>(`/Category/editCategory/${id}`, {
      method: 'PUT',
      body: formData,
    })
  },

  // Admin: Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/Category/deleteCategory/${id}`)
  },
}
