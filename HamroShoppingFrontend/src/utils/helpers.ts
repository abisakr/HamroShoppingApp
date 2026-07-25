// Currency formatting
export const formatters = {
  formatPrice: (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  },

  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  },

  formatDateTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  calculateDiscount: (originalPrice: number, discountedPrice: number) => {
    const discount = originalPrice - discountedPrice
    const percentage = Math.round((discount / originalPrice) * 100)
    return {
      discount,
      percentage,
      savings: discount,
    }
  },

  formatNumber: (num: number, decimals: number = 0): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  },
}

// Validation helpers
export const validators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  isValidPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  isValidZipCode: (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(?:-\d{4})?$/
    return zipRegex.test(zipCode)
  },

  arePasswordsMatching: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0
  },

  isValidCreditCard: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '')
    return /^\d{13,19}$/.test(cleaned)
  },
}

// String utilities
export const stringUtils = {
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str
    return str.substring(0, length) + suffix
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  toSlug: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  fromSlug: (slug: string): string => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  },
}

// Array utilities
export const arrayUtils = {
  chunk: <T,>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  unique: <T,>(array: T[]): T[] => {
    return [...new Set(array)]
  },

  sortBy: <T,>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  },

  groupBy: <T,>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce(
      (result, item) => {
        const groupKey = String(item[key])
        if (!result[groupKey]) {
          result[groupKey] = []
        }
        result[groupKey].push(item)
        return result
      },
      {} as Record<string, T[]>
    )
  },
}

// Object utilities
export const objectUtils = {
  isEmpty: (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0
  },

  removeNullValues: (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== null && value !== undefined)
    )
  },

  merge: <T,>(obj1: T, obj2: Partial<T>): T => {
    return { ...obj1, ...obj2 }
  },
}

// Local storage utilities
export const storageUtils = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  },

  get: <T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting localStorage:', error)
      return null
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing localStorage:', error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

// Delay utility for async operations
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Retry utility
export const retry = async <T,>(
  fn: () => Promise<T>,
  options = { retries: 3, delay: 1000 }
): Promise<T> => {
  let lastError: Error | null = null

  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < options.retries - 1) {
        await delay(options.delay * (i + 1))
      }
    }
  }

  throw lastError || new Error('Max retries reached')
}
