import { ErrorResponse } from '../types'

const API_BASE_URL = 'https://localhost:7223/api'

interface FetchOptions extends RequestInit {
  timeout?: number
}

class ApiClient {
  private baseUrl: string
  private defaultTimeout: number = 30000

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    const token = localStorage.getItem('accessToken')
    return token
  }

  private getHeaders(token?: string | null, isFormData: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {}

    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    const authToken = token || this.getAuthToken()
    if (authToken) {
      // Backend expects Authorization header format: "eyJFZWVlIjoicHJvdmVyYnNcbiJ9fQ"
      headers['Authorization'] = authToken
    }

    return headers
  }

  private async fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const timeout = options.timeout || this.defaultTimeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const isFormData = options.body instanceof FormData
    const headers = this.getHeaders(undefined, isFormData)

    try {
      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: 'include',
      })

      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
      }

      if (!response.ok) {
        try {
          const errorData = await response.json()
          const message = errorData.message || errorData.error || response.statusText
          throw new Error(message)
        } catch (e) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
      }

      const data: T = await response.json()
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      console.error('[API Error]', message)
      throw error
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
