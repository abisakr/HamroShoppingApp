import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { cartService } from '../services/cartService'
import { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  totalPrice: number
  totalQuantity: number
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  totalPrice: 0,
  totalQuantity: 0,
}

// Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCart()
    return Array.isArray(response.data) ? response.data : [response.data]
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartService.addToCart({ productId, quantity })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartService.updateCartItem(cartItemId, quantity)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(cartItemId)
      return cartItemId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart()
      return null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  return { totalQuantity, totalPrice }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      const totals = calculateTotals(action.payload)
      state.totalQuantity = totals.totalQuantity
      state.totalPrice = totals.totalPrice
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload as any
        state.items = Array.isArray(payload) ? payload : (payload?.items || [])
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalPrice = totals.totalPrice
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        const newItem = action.payload as CartItem
        const existingItem = state.items.find((item) => item.id === newItem.id)
        if (existingItem) {
          existingItem.quantity += newItem.quantity
        } else {
          state.items.push(newItem)
        }
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalPrice = totals.totalPrice
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        const updatedItem = action.payload as CartItem
        const existingItem = state.items.find((item) => item.id === updatedItem.id)
        if (existingItem) {
          existingItem.quantity = updatedItem.quantity
        }
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalPrice = totals.totalPrice
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter((item) => item.id !== action.payload)
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalPrice = totals.totalPrice
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false
        state.items = []
        state.totalQuantity = 0
        state.totalPrice = 0
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCartItems, clearError } = cartSlice.actions
export default cartSlice.reducer
