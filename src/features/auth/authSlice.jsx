import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axioConfiguration';

export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
      try {
        const response = await axiosInstance.post('api/register/', userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );
  export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
      try {
        const response = await axiosInstance.post('api/login/', userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return thunkAPI.rejectWithValue(error.response.data);
        } else {
          return thunkAPI.rejectWithValue({ error: 'An unexpected error occurred' });
        }
      }
    }
  );
  export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('api/forgot-password/', data);
        console.log(response)
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.patch('api/set-new-password/', data);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.detail || 'Failed to reset password');
        } else {
          return rejectWithValue('An unexpected error occurred');
        }
      }
    }
  );
  export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, thunkAPI) => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        // Optionally, verify the token with the server here
        return { token, user };
      }
      return thunkAPI.rejectWithValue('No valid session');
    }
  );
  
  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      user: null,
      token: null,
      isLoading: true,
      error: null,
    },
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      
    },
    extraReducers: (builder) => {
      builder
      
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.error || 'Login failed';
        })
        .addCase(checkAuthStatus.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(checkAuthStatus.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        })
        .addCase(checkAuthStatus.rejected, (state) => {
          state.isLoading = false;
          state.user = null;
          state.token = null;
        })
        .addCase(forgotPassword.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(resetPassword.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(resetPassword.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(resetPassword.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
        
       
    },
  });
  
  export const { logout } = authSlice.actions;
  export default authSlice.reducer;