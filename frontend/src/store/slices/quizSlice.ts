import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Types
interface QuizQuestion {
  questionId: string;
  questionText: string;
  questionType: 'scenario' | 'multiple-choice' | 'short-answer' | 'practical';
  scenario?: string;
  options?: string[];
  timeLimit: number;
  points: number;
}

interface QuizAttempt {
  quizSessionId: string;
  tier: 'foundational' | 'intermediate';
  questions: QuizQuestion[];
  timeLimit: number;
  status: 'in-progress' | 'completed';
  currentQuestionIndex: number;
  scores: {
    overall: {
      percentage: number;
      correctAnswers: number;
      totalQuestions: number;
    };
  };
}

interface QuizResult {
  quizSessionId: string;
  status: string;
  scores: {
    foundational: {
      percentage: number;
      correctAnswers: number;
      totalQuestions: number;
    };
    intermediate?: {
      percentage: number;
      correctAnswers: number;
      totalQuestions: number;
    };
    overall: {
      percentage: number;
      correctAnswers: number;
      totalQuestions: number;
    };
  };
  recommendation: {
    passToNextTier: boolean;
    overallScore: number;
    fitLevel: 'high' | 'medium' | 'low';
    interviewReadiness: 'ready' | 'needs-preparation' | 'not-ready';
    keyStrengths: string[];
    areasToProbe: string[];
    suggestedInterviewQuestions: string[];
  };
  analytics: {
    authenticityScore: number;
    suspiciousPatterns: Array<{
      type: string;
      confidence: number;
      details: string;
    }>;
  };
  crossReference: {
    cvClaims: Array<{
      skill: string;
      consistency: string;
      quizEvidence: string;
    }>;
    redFlags: Array<{
      type: string;
      description: string;
      severity: string;
    }>;
    hiddenGems: Array<{
      type: string;
      description: string;
      potential: string;
    }>;
  };
}

interface QuizState {
  currentAttempt: QuizAttempt | null;
  result: QuizResult | null;
  loading: boolean;
  error: string | null;
  quizStartTime: number | null;
  questionStartTime: number | null;
  timeRemaining: number;
  answers: Array<{
    questionIndex: number;
    answer: string | string[];
    timeTaken: number;
  }>;
}

const initialState: QuizState = {
  currentAttempt: null,
  result: null,
  loading: false,
  error: null,
  quizStartTime: null,
  questionStartTime: null,
  timeRemaining: 0,
  answers: [],
};

// Async thunks
export const startQuiz = createAsyncThunk(
  'quiz/startQuiz',
  async (params: { jobId: string; applicantId: string }) => {
    const response = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to start quiz');
    }
    
    return data.data;
  }
);

export const submitAnswer = createAsyncThunk(
  'quiz/submitAnswer',
  async (params: {
    quizSessionId: string;
    questionIndex: number;
    answer: string | string[];
    timeTaken: number;
  }) => {
    const response = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to submit answer');
    }
    
    return data.data;
  }
);

export const completeQuiz = createAsyncThunk(
  'quiz/completeQuiz',
  async (quizSessionId: string) => {
    const response = await fetch(`/api/quiz/complete/${quizSessionId}`, {
      method: 'POST',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to complete quiz');
    }
    
    return data.data;
  }
);

export const progressToIntermediate = createAsyncThunk(
  'quiz/progressToIntermediate',
  async (quizSessionId: string) => {
    const response = await fetch(`/api/quiz/progress/${quizSessionId}`, {
      method: 'POST',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to progress to intermediate tier');
    }
    
    return data.data;
  }
);

export const getQuizStatus = createAsyncThunk(
  'quiz/getQuizStatus',
  async (quizSessionId: string) => {
    const response = await fetch(`/api/quiz/status/${quizSessionId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get quiz status');
    }
    
    return data.data;
  }
);

// Slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizStartTime: (state, action: PayloadAction<number>) => {
      state.quizStartTime = action.payload;
    },
    setQuestionStartTime: (state, action: PayloadAction<number>) => {
      state.questionStartTime = action.payload;
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = Math.max(0, action.payload);
    },
    addAnswer: (state, action: PayloadAction<{
      questionIndex: number;
      answer: string | string[];
      timeTaken: number;
    }>) => {
      const existingIndex = state.answers.findIndex(
        a => a.questionIndex === action.payload.questionIndex
      );
      
      if (existingIndex >= 0) {
        state.answers[existingIndex] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    clearQuiz: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Start Quiz
    builder
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttempt = {
          quizSessionId: action.payload.quizSessionId,
          tier: action.payload.tier,
          questions: action.payload.questions,
          timeLimit: action.payload.timeLimit,
          status: 'in-progress',
          currentQuestionIndex: 0,
          scores: {
            overall: {
              percentage: 0,
              correctAnswers: 0,
              totalQuestions: action.payload.questions.length,
            },
          },
        };
        state.timeRemaining = action.payload.timeLimit;
        state.quizStartTime = Date.now();
        state.questionStartTime = Date.now();
        state.answers = [];
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start quiz';
      });

    // Submit Answer
    builder
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update current question score
        if (state.currentAttempt) {
          state.currentAttempt.scores.overall.percentage = action.payload.currentScore;
        }
        
        // Move to next question
        if (state.currentAttempt) {
          state.currentAttempt.currentQuestionIndex++;
        }
        
        state.questionStartTime = Date.now();
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit answer';
      });

    // Complete Quiz
    builder
      .addCase(completeQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        if (state.currentAttempt) {
          state.currentAttempt.status = 'completed';
        }
      })
      .addCase(completeQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete quiz';
      });

    // Progress to Intermediate
    builder
      .addCase(progressToIntermediate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(progressToIntermediate.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.currentAttempt) {
          state.currentAttempt.tier = 'intermediate';
          state.currentAttempt.questions = action.payload.questions;
          state.currentAttempt.currentQuestionIndex = 0;
          state.currentAttempt.status = 'in-progress';
          state.currentAttempt.scores.overall.totalQuestions = action.payload.questions.length;
        }
        
        state.timeRemaining = action.payload.timeLimit;
        state.quizStartTime = Date.now();
        state.questionStartTime = Date.now();
        state.answers = [];
      })
      .addCase(progressToIntermediate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to progress to intermediate tier';
      });

    // Get Quiz Status
    builder
      .addCase(getQuizStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentAttempt) {
          state.currentAttempt.status = action.payload.status;
          state.currentAttempt.scores = action.payload.scores;
          state.currentAttempt.currentQuestionIndex = action.payload.currentQuestionIndex;
        }
      })
      .addCase(getQuizStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get quiz status';
      });
  },
});

export const {
  setQuizStartTime,
  setQuestionStartTime,
  updateTimeRemaining,
  addAnswer,
  clearQuiz,
  clearError,
} = quizSlice.actions;
export default quizSlice.reducer;

// Selectors
export const selectCurrentAttempt = (state: RootState) => state.quiz.currentAttempt;
export const selectQuizResult = (state: RootState) => state.quiz.result;
export const selectQuizLoading = (state: RootState) => state.quiz.loading;
export const selectQuizError = (state: RootState) => state.quiz.error;
export const selectTimeRemaining = (state: RootState) => state.quiz.timeRemaining;
export const selectCurrentQuestion = (state: RootState) => {
  const attempt = state.quiz.currentAttempt;
  if (!attempt) return null;
  return attempt.questions[attempt.currentQuestionIndex] || null;
};
export const selectProgress = (state: RootState) => {
  const attempt = state.quiz.currentAttempt;
  if (!attempt) return 0;
  return (attempt.currentQuestionIndex / attempt.questions.length) * 100;
};
