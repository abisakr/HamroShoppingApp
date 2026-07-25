import { apiClient } from './apiClient'
import { User } from '../types'

interface UsersResponse {
  statusCode: number
  message: string
  data: User[]
  total?: number
}

interface UserResponse {
  statusCode: number
  message: string
  data: User
}

export const userService = {
  // Admin endpoints
  getAllUsers: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string
  ): Promise<UsersResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (search) params.append('search', search)
    if (role) params.append('role', role)

    return apiClient.get<UsersResponse>(`/User/admin/all?${params.toString()}`)
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/User/${id}`)
  },

  updateUser: async (id: string, data: Partial<User>): Promise<UserResponse> => {
    return apiClient.put<UserResponse>(`/User/${id}`, data)
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/User/${id}`)
  },

  blockUser: async (id: string): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/User/${id}/block`, {})
  },

  unblockUser: async (id: string): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/User/${id}/unblock`, {})
  },

  makeAdmin: async (id: string): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/User/${id}/make-admin`, {})
  },

  removeAdmin: async (id: string): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/User/${id}/remove-admin`, {})
  },

  getUserStats: async (): Promise<any> => {
    return apiClient.get('/User/admin/stats')
  },

  searchUsers: async (query: string, page: number = 1): Promise<UsersResponse> => {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
    })
    return apiClient.get<UsersResponse>(`/User/admin/search?${params.toString()}`)
  },
}
