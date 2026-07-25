import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '../services/orderService'
import { Order, CreateOrderRequest, OrderStatus } from '../types'

interface OrderState {
  orders: Order[]
  selectedOrder: Order | null
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
}

// Thunks
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ page = 1 }: { page?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders(page)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Admin thunks
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (
    { page = 1, status }: { page?: number; status?: OrderStatus } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await orderService.getAllOrders(page, 20, status)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    { id, status, notes }: { id: string; status: OrderStatus; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderService.updateOrderStatus(id, status, notes)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch User Orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = Array.isArray(action.payload.data) ? action.payload.data : []
        state.totalCount = action.payload.total || 0
        state.currentPage = action.payload.page || 1
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedOrder = (action.payload as any)?.data || (action.payload as any)
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = (action.payload as any)?.data || (action.payload as any)
        state.orders.unshift(payload)
        state.selectedOrder = payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = (action.payload as any)?.data || (action.payload as any)
        const index = state.orders.findIndex((order) => order.id === payload?.id)
        if (index !== -1) {
          state.orders[index] = payload
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch All Orders (Admin)
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = Array.isArray(action.payload.data) ? action.payload.data : []
        state.totalCount = action.payload.total || 0
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = (action.payload as any)?.data || (action.payload as any)
        const index = state.orders.findIndex((order) => order.id === payload?.id)
        if (index !== -1) {
          state.orders[index] = payload
        }
        if (state.selectedOrder?.id === payload?.id) {
          state.selectedOrder = payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedOrder, clearError } = orderSlice.actions
export default orderSlice.reducer
