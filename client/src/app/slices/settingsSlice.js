import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsApi } from '../../api/settings.api.js';

export const loadSettings = createAsyncThunk('settings/load', async () => {
  return settingsApi.getPublic();
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadSettings.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default settingsSlice.reducer;
