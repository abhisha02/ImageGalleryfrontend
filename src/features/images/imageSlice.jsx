import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axioConfiguration';

export const fetchImages = createAsyncThunk(
    'images/fetchImages',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('api/images/');
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Unexpected API response structure:', response.data);
          return [];
        }
      } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while fetching images');
      }
    }
  );
  
  export const uploadImages = createAsyncThunk(
    'images/uploadImages',
    async (formData, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('api/images/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Fetch updated images after successful upload
        dispatch(fetchImages());
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while uploading images');
      }
    }
  );

export const updateImageOrder = createAsyncThunk(
  'images/updateImageOrder',
  async (orderedImages, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('api/images/reorder/', { ordered_images: orderedImages });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateImage = createAsyncThunk(
  'images/updateImage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`api/images/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`api/images/${imageId}/`);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState: {
    images: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = Array.isArray(action.payload) 
          ? [...state.images, ...action.payload].sort((a, b) => a.order - b.order)
          : [...state.images, action.payload].sort((a, b) => a.order - b.order);
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          state.images = action.payload.map(img => ({
            ...img,
            id: String(img.id)
          }));
        } else {
          console.error('Received payload is not an array:', action.payload);
          state.images = [];
        }
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateImageOrder.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.images = action.payload.map(img => ({
            ...img,
            id: String(img.id)
          }));
        }
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const index = state.images.findIndex(img => img.id === String(action.payload.id));
        if (index !== -1) {
          state.images[index] = {
            ...action.payload,
            id: String(action.payload.id)
          };
        }
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== String(action.payload));
      });
  },
});

export default imageSlice.reducer;