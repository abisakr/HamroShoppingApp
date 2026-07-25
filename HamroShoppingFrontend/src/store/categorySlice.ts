import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { categoryService } from '../services/categoryService'
import { Category } from '../types'

interface CategoryState {
  items: Category[]
  isLoading: boolean
  error: string | null
}

const initialState: CategoryState = {
  items: [],
  isLoading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload as any
        const category = payload.data || payload
        const existingIndex = state.items.findIndex((cat) => cat.id === category.id)
        if (existingIndex !== -1) {
          state.items[existingIndex] = category
        } else {
          state.items.push(category)
        }
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = categorySlice.actions
export default categorySlice.reducer
