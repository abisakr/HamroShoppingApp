import { apiClient } from './apiClient'
import { Product, ProductsResponse, ProductDetailsResponse } from '../types'

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>('/Product/getAllProducts')
  },

  // Get product by ID
  getProductById: async (id: number): Promise<ProductDetailsResponse> => {
    return apiClient.get<ProductDetailsResponse>(`/Product/getProductById/${id}`)
  },

  // Get popular products
  getPopularProducts: async (): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>('/Product/getAllPopularProducts')
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>(`/Product/getProductByCategoryId/${categoryId}`)
  },

  // Search products by name
  searchProducts: async (name: string): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>(`/Product/getAllSearchedProducts?name=${name}`)
  },

  // Get sorted/filtered products
  getFilteredProducts: async (categoryName?: string, order?: string): Promise<ProductsResponse> => {
    const params = new URLSearchParams()
    if (categoryName) params.append('categoryName', categoryName)
    if (order) params.append('order', order) // 'd' for descending, 'a' for ascending
    
    return apiClient.get<ProductsResponse>(`/Product/getShortedFilteredProduct?${params.toString()}`)
  },

  // Admin: Create product (requires multipart form data)
  createProduct: async (formData: FormData): Promise<ProductDetailsResponse> => {
    return apiClient.request<ProductDetailsResponse>('/Product/createProduct', {
      method: 'POST',
      body: formData,
    })
  },

  // Admin: Update product
  updateProduct: async (id: number, formData: FormData): Promise<ProductDetailsResponse> => {
    return apiClient.request<ProductDetailsResponse>(`/Product/editProduct/${id}`, {
      method: 'PUT',
      body: formData,
    })
  },

  // Admin: Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/Product/deleteProduct/${id}`)
  },
}
// Function to fetch products (Matching your exact pattern)
export async function getAllProducts() {
  const response = await fetch(
    "https://localhost:7223/api/Product/getAllProducts",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products");
  }

  return result; // This returns the array of products
}