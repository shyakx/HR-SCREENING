import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './slices/jobsSlice';
import applicantsReducer from './slices/applicantsSlice';
import screeningReducer from './slices/screeningSlice';
import quizReducer from './slices/quizSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    applicants: applicantsReducer,
    screening: screeningReducer,
    quiz: quizReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
