// src/redux/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  referralCode: string
  balance: number
}

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  registerError: string | null
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  registerStatus: 'idle',
  registerError: null
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://pepper-be.onrender.com/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed')
      }
      return rejectWithValue((error as Error).message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password, referralCode }: 
    { name: string; email: string; password: string; referralCode?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('https://pepper-be.onrender.com/auth/register', {
        name,
        email,
        password,
        referralCode: referralCode || undefined
      })
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed')
      }
      return rejectWithValue((error as Error).message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearError: (state) => {
      state.error = null
      state.registerError = null
    },
    resetRegisterStatus: (state) => {
      state.registerStatus = 'idle'
      state.registerError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading'
        state.registerError = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded'
        state.user = action.payload.user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed'
        state.registerError = action.payload as string
      })
  },
})

export const { logout, clearError, resetRegisterStatus } = authSlice.actions
export default authSlice.reducer