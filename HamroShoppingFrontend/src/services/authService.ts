import { apiClient } from './apiClient'
import {
  AuthResponse,
  LoginRequest,
  AdminLoginRequest,
  SignUpRequest,
  User,
} from '../types'

export const authService = {
  // User login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/UserAccount/login/user', credentials)
    if (response.token) {
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('tokenExpires', response.expires || '')
    }
    return response
  },

  // Admin login
  adminLogin: async (credentials: AdminLoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/UserAccount/login/admin', credentials)
    if (response.token) {
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('tokenExpires', response.expires || '')
      localStorage.setItem('isAdmin', 'true')
    }
    return response
  },

  // User registration
  signup: async (data: SignUpRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/UserAccount/register', data)
  },

  // Google login
  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/UserAccount/google', { token })
    if (response.token) {
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('tokenExpires', response.expires || '')
    }
    return response
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/UserAccount/logout', {})
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('tokenExpires')
    }
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/UserAccount/forgot-password', { email })
  },

  resetPassword: async (email: string, token: string, newPassword: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/UserAccount/reset-password', {
      email,
      token,
      newPassword,
    })
  },

  getToken: (): string | null => {
    return localStorage.getItem('accessToken')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken')
  },

  isAdmin: (): boolean => {
    return localStorage.getItem('isAdmin') === 'true'
  },

  clearAuth: (): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('tokenExpires')
  },
}
