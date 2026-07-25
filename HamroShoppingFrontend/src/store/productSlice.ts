import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '../services/productService'
import { Product } from '../types'

interface ProductsState {
  items: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  filters: {
    search?: string
    category?: string
    sort?: string
  }
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filters: {},
}

// Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    {
      page = 1,
      limit = 20,
      search,
      category,
      sort,
    }: {
      page?: number
      limit?: number
      search?: string
      category?: string
      sort?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.getAllProducts(page, limit, search, category, sort)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (
    { categoryId, page = 1 }: { categoryId: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, page)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query, page)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts(limit)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    setFilters: (state, action) => {
      state.filters = action.payload
      state.currentPage = 1
    },
    clearFilters: (state) => {
      state.filters = {}
      state.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data || []
        state.totalCount = action.payload.total || 0
        state.currentPage = action.payload.page || 1
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch by Category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data || []
        state.totalCount = action.payload.total || 0
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Search Products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data || []
        state.totalCount = action.payload.total || 0
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Featured
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedProduct, setFilters, clearFilters } = productSlice.actions
export default productSlice.reducer
