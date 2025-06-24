import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsAPI } from './settingsAPI';

interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisible: true,
      dataSharing: false,
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    },
  },
  isLoading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk<Settings>(
  'settings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsAPI.getSettings();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk<Settings, Partial<Settings>>(
  'settings/update',
  async (updates, { rejectWithValue }) => {
    try {
      return await settingsAPI.updateSettings(updates);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateLocalSettings } = settingsSlice.actions;
export default settingsSlice.reducer;