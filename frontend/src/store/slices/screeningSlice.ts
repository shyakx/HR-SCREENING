import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ScreeningResult, Shortlist } from '../../types';
import { screeningApi } from '../../lib/endpoints';

interface ScreeningState {
  results: ScreeningResult[];
  shortlists: Shortlist[];
  currentShortlist: Shortlist | null;
  loading: boolean;
  error: string | null;
  screeningProgress: number;
}

const initialState: ScreeningState = {
  results: [],
  shortlists: [],
  currentShortlist: null,
  loading: false,
  error: null,
  screeningProgress: 0,
};

export const runScreening = createAsyncThunk(
  'screening/runScreening',
  async ({ jobId, applicantIds }: { jobId: string; applicantIds: string[] }, { rejectWithValue }) => {
    try {
      console.log('🔄 Making API call to run screening...');
      const response = await screeningApi.runScreening(jobId, applicantIds);
      console.log('📡 API Response:', response);
      
      const resData = response.data as any;
      console.log('📊 Response data:', resData);
      
      if (resData.success && resData.data) {
        console.log('✅ Returning screening results:', resData.data.length);
        return resData.data;
      } else {
        console.log('❌ API returned error:', resData);
        return rejectWithValue(resData.message || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('💥 Network/API Error:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to run screening';
      const errorType = error.response?.data?.type;
      
      // Provide user-friendly messages for different error types
      if (errorType === 'rate_limit_error') {
        return rejectWithValue('AI service is busy. Please wait 30 seconds and try again.');
      } else if (errorType === 'ai_service_error') {
        return rejectWithValue('AI service temporarily unavailable. Using smart analysis fallback.');
      } else if (error.response?.status === 429) {
        return rejectWithValue('Too many requests to AI service. Please wait and retry.');
      } else if (error.response?.status >= 500) {
        return rejectWithValue('Server error. Please try again in a moment.');
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchShortlists = createAsyncThunk(
  'screening/fetchShortlists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await screeningApi.getShortlists();
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shortlists');
    }
  }
);

export const createShortlist = createAsyncThunk(
  'screening/createShortlist',
  async ({ jobId, title, candidateIds }: { jobId: string; title: string; candidateIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await screeningApi.createShortlist(jobId, title, candidateIds);
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create shortlist');
    }
  }
);

export const deleteShortlist = createAsyncThunk(
  'screening/deleteShortlist',
  async (id: string, { rejectWithValue }) => {
    try {
      await screeningApi.deleteShortlist(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete shortlist');
    }
  }
);

const screeningSlice = createSlice({
  name: 'screening',
  initialState,
  reducers: {
    setCurrentShortlist: (state, action: PayloadAction<Shortlist | null>) => {
      state.currentShortlist = action.payload;
    },
    setScreeningProgress: (state, action: PayloadAction<number>) => {
      state.screeningProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runScreening.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.screeningProgress = 0;
      })
      .addCase(runScreening.fulfilled, (state, action) => {
        state.loading = false;
        // Add new results to existing results, avoiding duplicates
        const newResults = action.payload;
        const existingIds = new Set(state.results.map(r => r._id));
        const uniqueNewResults = newResults.filter((r: any) => !existingIds.has(r._id));
        state.results = [...state.results, ...uniqueNewResults];
        state.screeningProgress = 100;
      })
      .addCase(runScreening.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.screeningProgress = 0;
      })
      .addCase(fetchShortlists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortlists.fulfilled, (state, action) => {
        state.loading = false;
        state.shortlists = action.payload;
      })
      .addCase(fetchShortlists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createShortlist.fulfilled, (state, action) => {
        state.shortlists.push(action.payload);
      })
      .addCase(deleteShortlist.fulfilled, (state, action) => {
        state.shortlists = state.shortlists.filter(s => s._id !== action.payload);
        if (state.currentShortlist?._id === action.payload) {
          state.currentShortlist = null;
        }
      });
  },
});

export const { setCurrentShortlist, setScreeningProgress, clearError } = screeningSlice.actions;
export default screeningSlice.reducer;
