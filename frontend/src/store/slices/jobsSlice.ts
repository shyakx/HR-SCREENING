import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '../../types';
import { jobsApi } from '../../lib/endpoints';

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsApi.getAllJobs();
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Partial<Job>, { rejectWithValue }) => {
    try {
      const response = await jobsApi.createJob(jobData);
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }: { id: string; jobData: Partial<Job> }, { rejectWithValue }) => {
    try {
      const response = await jobsApi.updateJob(id, jobData);
      const resData = response.data as any;
      return resData.data || resData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await jobsApi.deleteJob(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        if (state.currentJob?._id === action.payload) {
          state.currentJob = null;
        }
      });
  },
});

export const { setCurrentJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
