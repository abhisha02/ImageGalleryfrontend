import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import imageReducer from '../images/imageSlice';



export const store = configureStore({
    reducer: {
      auth: authReducer,
      images : imageReducer,
   
    },
  });
