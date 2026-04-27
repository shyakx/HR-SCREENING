'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  startQuiz, 
  submitAnswer, 
  completeQuiz, 
  progressToIntermediate,
  selectCurrentAttempt,
  selectQuizResult,
  selectQuizLoading,
  selectQuizError,
  selectTimeRemaining,
  selectCurrentQuestion,
  selectProgress,
  setQuizStartTime,
  setQuestionStartTime,
  updateTimeRemaining,
  addAnswer,
  clearQuiz
} from '@/store/slices/quizSlice';
import { RootState, AppDispatch } from '@/store';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

function QuizPageContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentAttempt = useSelector(selectCurrentAttempt);
  const quizResult = useSelector(selectQuizResult);
  const loading = useSelector(selectQuizLoading);
  const error = useSelector(selectQuizError);
  const timeRemaining = useSelector(selectTimeRemaining);
  const currentQuestion = useSelector(selectCurrentQuestion);
  const progress = useSelector(selectProgress);

  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const jobId = searchParams.get('jobId');
  const applicantId = searchParams.get('applicantId');

  useEffect(() => {
    if (!jobId || !applicantId) {
      router.push('/jobs');
      return;
    }

    // Start quiz when component mounts
    dispatch(startQuiz({ jobId, applicantId }));
    dispatch(setQuizStartTime(Date.now()));

    return () => {
      dispatch(clearQuiz());
    };
  }, [dispatch, jobId, applicantId, router]);

  useEffect(() => {
    if (!currentAttempt) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - (currentAttempt.status === 'in-progress' ? Date.now() : Date.now());
      const remaining = Math.max(0, currentAttempt.timeLimit - Math.floor(elapsed / 1000));
      dispatch(updateTimeRemaining(remaining));

      if (remaining === 0 && currentAttempt.status === 'in-progress') {
        handleTimeout();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, currentAttempt]);

  const handleTimeout = async () => {
    if (currentAttempt) {
      await dispatch(completeQuiz(currentAttempt.quizSessionId));
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAttempt || !currentQuestion || !selectedAnswer) return;

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    try {
      await dispatch(submitAnswer({
        quizSessionId: currentAttempt.quizSessionId,
        questionIndex: currentAttempt.currentQuestionIndex,
        answer: selectedAnswer,
        timeTaken,
      })).unwrap();

      dispatch(addAnswer({
        questionIndex: currentAttempt.currentQuestionIndex,
        answer: selectedAnswer,
        timeTaken,
      }));

      setSelectedAnswer('');
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleCompleteQuiz = async () => {
    if (!currentAttempt) return;

    try {
      await dispatch(completeQuiz(currentAttempt.quizSessionId)).unwrap();
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const handleProgressToIntermediate = async () => {
    if (!quizResult) return;

    try {
      await dispatch(progressToIntermediate(quizResult.quizSessionId)).unwrap();
    } catch (error) {
      console.error('Error progressing to intermediate:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (timeRemaining > 300) return 'text-green-600';
    if (timeRemaining > 120) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading && !currentAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting Role Fit Check...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/jobs')}
            className="btn btn-primary"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8">
            <div className="text-center mb-8">
              <ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Role Fit Check Complete!</h1>
              <p className="text-gray-600">Here's how you performed</p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {quizResult.scores.overall.percentage.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {quizResult.scores.overall.correctAnswers}/{quizResult.scores.overall.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2 capitalize">
                  {quizResult.recommendation.fitLevel}
                </div>
                <div className="text-sm text-gray-600">Fit Level</div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendation</h2>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    quizResult.recommendation.passToNextTier ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">
                    {quizResult.recommendation.passToNextTier 
                      ? 'Eligible for next tier' 
                      : 'Complete foundational tier first'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">
                  Interview Readiness: <span className="font-medium capitalize">
                    {quizResult.recommendation.interviewReadiness.replace('-', ' ')}
                  </span>
                </p>

                {quizResult.recommendation.keyStrengths.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Key Strengths:</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {quizResult.recommendation.keyStrengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResult.recommendation.areasToProbe.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Areas to Explore Further:</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {quizResult.recommendation.areasToProbe.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Cross-Reference Analysis */}
            {quizResult.crossReference.redFlags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cross-Reference Analysis</h2>
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Items to Verify</span>
                  </div>
                  <ul className="space-y-2">
                    {quizResult.crossReference.redFlags.map((flag, index) => (
                      <li key={index} className="text-yellow-800">
                        <span className="font-medium capitalize">{flag.type}:</span> {flag.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {quizResult.recommendation.passToNextTier && !quizResult.scores.intermediate && (
                <button
                  onClick={handleProgressToIntermediate}
                  className="btn btn-primary flex-1"
                >
                  Continue to Intermediate Tier
                </button>
              )}
              
              <button
                onClick={() => router.push('/jobs')}
                className="btn btn-secondary flex-1"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentAttempt || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentAttempt.currentQuestionIndex === currentAttempt.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role Fit Check</h1>
              <p className="text-gray-600 capitalize">{currentAttempt.tier} Tier</p>
            </div>
            
            <div className={`flex items-center ${getProgressColor()}`}>
              <ClockIcon className="w-5 h-5 mr-2" />
              <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Question {currentAttempt.currentQuestionIndex + 1} of {currentAttempt.questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-8">
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentQuestion.questionText}
                </h2>
                
                {currentQuestion.scenario && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
                    <p className="text-gray-700">{currentQuestion.scenario}</p>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span>Points: {currentQuestion.points}</span>
                  <span>Time Limit: {currentQuestion.timeLimit}s</span>
                  <span className="capitalize">{currentQuestion.questionType}</span>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.questionType === 'multiple-choice' && currentQuestion.options && (
                currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))
              )}

              {(currentQuestion.questionType === 'short-answer' || 
                currentQuestion.questionType === 'scenario' || 
                currentQuestion.questionType === 'practical') && (
                <textarea
                  value={selectedAnswer as string}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="input w-full h-32 resize-none"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedAnswer ? (
                <span className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Answer ready
                </span>
              ) : (
                <span>Please select or type your answer</span>
              )}
            </div>

            <div className="flex gap-3">
              {isLastQuestion ? (
                <button
                  onClick={handleCompleteQuiz}
                  disabled={!selectedAnswer || loading}
                  className="btn btn-primary flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                  )}
                  Complete Quiz
                </button>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || loading}
                  className="btn btn-primary flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <ArrowRightIcon className="w-4 h-4 mr-2" />
                  )}
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <LightBulbIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Tips for success:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Read each question carefully before answering</li>
                <li>Provide specific examples from your experience</li>
                <li>Take your time, but be mindful of the time limit</li>
                <li>Be authentic - there are no "perfect" answers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}
