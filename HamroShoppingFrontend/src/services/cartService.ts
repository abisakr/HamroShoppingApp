import { apiClient } from './apiClient'
import { CartResponse, AddToCartRequest, CartItem } from '../types'

export const cartService = {
  // Get all cart items for current user
  getCart: async (): Promise<CartResponse> => {
    return apiClient.get<CartResponse>('/Cart/getCartsByUserId')
  },

  // Get all cart items (admin)
  getAllCarts: async (): Promise<CartResponse> => {
    return apiClient.get<CartResponse>('/Cart/getAllCarts')
  },

  // Add product to cart
  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    return apiClient.post<CartResponse>('/Cart/createCart', data)
  },

  // Update cart item quantity
  updateCartItem: async (id: number, quantity: number): Promise<CartResponse> => {
    return apiClient.put<CartResponse>(`/Cart/editCart/${id}`, { quantity })
  },

  // Remove item from cart
  removeFromCart: async (id: number): Promise<CartResponse> => {
    return apiClient.delete<CartResponse>(`/Cart/deleteCart/${id}`)
  },

  // Get cart count
  getCartCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<CartResponse>('/Cart/getCartsByUserId')
      const items = response.data
      if (Array.isArray(items)) {
        return items.length
      }
      return 0
    } catch {
      return 0
    }
  },
}
