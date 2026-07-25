// User & Auth Types
export interface User {
  id?: string
  fullName?: string
  name?: string // Backward compatibility
  phoneNo?: string
  email?: string
  address?: string
  city?: string
  country?: string
  password?: string
  role?: 'ADMIN' | 'USER'
}

export interface AuthResponse {
  message: string
  token?: string
  expires?: string
}

export interface LoginRequest {
  phoneNoAsUser: string
  password: string
}

export interface AdminLoginRequest {
  phoneNoAsUser: string
  password: string
}

export interface SignUpRequest {
  fullName: string
  phoneNo: string
  email: string
  address: string
  city: string
  country: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

// Category Types
export interface Category {
  id: number
  categoryName: string
  photoPath?: string
}

export interface CategoriesResponse {
  message: string
  data?: Category[]
}

// Product Types
export interface Product {
  id: number
  categoryId: number
  categoryName: string
  productName: string
  price: number
  discount: string | number
  stockQuantity: number
  stockSold: number
  description: string
  deliveryStatus: string
  productRating?: number | null
  totalProductRated?: number | null
  photoPath?: string
  // Backward compatibility
  image?: string
  stock?: number
  rating?: number | null
  totalRatings?: number | null
  discountedPrice?: number
}

export interface ProductsResponse {
  message: string
  data?: Product[]
}

export interface ProductDetailsResponse {
  message: string
  data?: Product
}

// Cart Types
export interface CartItem {
  id: number
  productId: number
  userId: string
  productName: string
  productPhoto?: string | null
  quantity: number
  totalCarts: number
  price: number
  totalPrice: number
  // Backward compatibility
  product?: Product
}

export interface Cart {
  data?: CartItem[]
}

export interface CartResponse {
  message: string
  data?: CartItem | CartItem[] | Cart
}

export interface AddToCartRequest {
  productId: number
  quantity?: number
}

export interface UpdateCartRequest {
  quantity: number
}

// Order Types
export interface OrderItem {
  productId: number
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  userId: string
  productName: string
  phoneNumber?: string | null
  address?: string | null
  photoPath?: string | null
  categoryName?: string | null
  fullName?: string | null
  quantity: number
  unitPrice: number
  orderStatus: string
  totalPrice: number
}

export interface OrdersResponse {
  message: string
  data?: Order | Order[]
}

export interface CreateOrderRequest {
  items?: OrderItem[]
  // Backward compatibility
  shippingAddress?: string
  billingAddress?: string
  paymentMethod?: string
  notes?: string
}

// Rating/Review Types
export interface Rating {
  id: number
  userId: string
  productId: number
  userRating: number
  review: string
}

export interface RatingsResponse {
  message: string
  data?: Rating | Rating[]
}

export interface CreateRatingRequest {
  productId: number
  userRating: number
  review: string
}

// API Response Types
export interface ApiResponse<T> {
  message: string
  data?: T
  error?: string
}

// Error Response
export interface ErrorResponse {
  message: string
  error?: string
}
