import { apiClient } from './apiClient'
import { RatingsResponse, CreateRatingRequest } from '../types'

export const ratingService = {
  // Get ratings for a product
  getProductRatings: async (productId: number): Promise<RatingsResponse> => {
    return apiClient.get<RatingsResponse>(`/Rating/getRatingsByProductId/${productId}`)
  },

  // Get user's rating for a specific product
  getUserProductRating: async (productId: number): Promise<RatingsResponse> => {
    return apiClient.get<RatingsResponse>(`/Rating/getRatingByUserIdProductId/${productId}`)
  },

  // Create a rating/review
  createRating: async (data: CreateRatingRequest): Promise<RatingsResponse> => {
    return apiClient.post<RatingsResponse>('/Rating/createRating', data)
  },

  // Update a rating/review
  updateRating: async (id: number, data: Partial<CreateRatingRequest>): Promise<RatingsResponse> => {
    return apiClient.put<RatingsResponse>(`/Rating/editRating/${id}`, data)
  },

  // Delete a rating/review
  deleteRating: async (id: number): Promise<void> => {
    await apiClient.delete(`/Rating/deleteRating/${id}`)
  },
}
