import { apiClient } from './apiClient'
import { OrdersResponse, CreateOrderRequest } from '../types'

export const orderService = {
  // Create order from cart items
  createCartOrder: async (items: any[]): Promise<OrdersResponse> => {
    return apiClient.post<OrdersResponse>('/Order/createCartOrder', items)
  },

  // Create direct order (buy now)
  createDirectOrder: async (items: any[]): Promise<OrdersResponse> => {
    return apiClient.post<OrdersResponse>('/Order/createDirectOrder', items)
  },

  // Get user's orders
  getUserOrders: async (): Promise<OrdersResponse> => {
    return apiClient.get<OrdersResponse>('/Order/getOrdersByUserId')
  },

  // Get all orders (admin)
  getAllOrders: async (): Promise<OrdersResponse> => {
    return apiClient.get<OrdersResponse>('/Order/getAllOrder')
  },
}
