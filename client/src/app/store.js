import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import settingsReducer from './slices/settingsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
  },
});
