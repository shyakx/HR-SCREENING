import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Applicant } from '../../types';
import { applicantsApi } from '../../lib/endpoints';

interface ApplicantsState {
  applicants: Applicant[];
  currentApplicant: Applicant | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: ApplicantsState = {
  applicants: [],
  currentApplicant: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

export const fetchApplicants = createAsyncThunk(
  'applicants/fetchApplicants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicantsApi.getAllApplicants();
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applicants');
    }
  }
);

export const createApplicant = createAsyncThunk(
  'applicants/createApplicant',
  async (applicantData: Partial<Applicant>, { rejectWithValue }) => {
    try {
      const response = await applicantsApi.createApplicant(applicantData);
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create applicant');
    }
  }
);

export const updateApplicant = createAsyncThunk(
  'applicants/updateApplicant',
  async ({ id, applicantData }: { id: string; applicantData: Partial<Applicant> }, { rejectWithValue }) => {
    try {
      const response = await applicantsApi.updateApplicant(id, applicantData);
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update applicant');
    }
  }
);

export const deleteApplicant = createAsyncThunk(
  'applicants/deleteApplicant',
  async (id: string, { rejectWithValue }) => {
    try {
      await applicantsApi.deleteApplicant(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete applicant');
    }
  }
);

export const uploadApplicants = createAsyncThunk(
  'applicants/uploadApplicants',
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const response = await applicantsApi.uploadApplicants(file, (progress) => {
        dispatch(setUploadProgress(progress));
      });
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload applicants');
    }
  }
);

const applicantsSlice = createSlice({
  name: 'applicants',
  initialState,
  reducers: {
    setCurrentApplicant: (state, action: PayloadAction<Applicant | null>) => {
      state.currentApplicant = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createApplicant.fulfilled, (state, action) => {
        state.applicants.push(action.payload);
      })
      .addCase(updateApplicant.fulfilled, (state, action) => {
        const index = state.applicants.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.applicants[index] = action.payload;
        }
        if (state.currentApplicant?._id === action.payload._id) {
          state.currentApplicant = action.payload;
        }
      })
      .addCase(deleteApplicant.fulfilled, (state, action) => {
        state.applicants = state.applicants.filter(a => a._id !== action.payload);
        if (state.currentApplicant?._id === action.payload) {
          state.currentApplicant = null;
        }
      })
      .addCase(uploadApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = [...state.applicants, ...action.payload];
        state.uploadProgress = 100;
      })
      .addCase(uploadApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      });
  },
});

export const { setCurrentApplicant, setUploadProgress, clearError } = applicantsSlice.actions;
export default applicantsSlice.reducer;
