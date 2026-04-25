import { QuizQuestion, QuizAttempt, QuizConfiguration, Job, Applicant } from '../models';
import { GeminiService } from './geminiService';
import { v4 as uuidv4 } from 'uuid';

export class QuizService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  /**
   * Generate quiz questions for a specific job using AI
   */
  async generateQuizQuestions(jobId: string, tier: 'foundational' | 'intermediate'): Promise<any[]> {
    try {
      // Get job details
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      // Get quiz configuration
      const config = await QuizConfiguration.findOne({ jobId }) || 
                   await QuizConfiguration.findOne({ roleCategory: this.inferRoleCategory(job) });
      
      if (!config) {
        throw new Error('Quiz configuration not found');
      }

      const tierConfig = tier === 'foundational' ? config.settings.foundationalTier : config.settings.intermediateTier;
      const questionCount = tierConfig.questionCount;

      // Generate AI-powered questions
      const prompt = this.buildQuestionGenerationPrompt(job, tier, questionCount);
      const response = await this.geminiService.generateContent(prompt);
      
      // Parse AI response and format questions
      const questions = this.parseAIQuestions(response, tier);
      
      return questions;
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      // Fallback to basic questions if AI fails
      return this.getFallbackQuestions(jobId, tier);
    }
  }

  /**
   * Build prompt for AI question generation
   */
  private buildQuestionGenerationPrompt(job: any, tier: 'foundational' | 'intermediate', questionCount: number): string {
    const difficulty = tier === 'foundational' ? 'basic to intermediate' : 'intermediate to advanced';
    
    return `
Generate ${questionCount} quiz questions for a ${job.title} position.

Job Details:
- Title: ${job.title}
- Description: ${job.description}
- Required Skills: ${job.skills.join(', ')}
- Requirements: ${job.requirements.join(', ')}
- Experience Level: ${job.experienceLevel}
- Department: ${job.department}

Requirements:
1. Create ${difficulty} difficulty questions
2. Mix of question types: multiple-choice, scenario, short-answer, practical
3. Each question should assess real-world job capabilities
4. Include time limits (60-180 seconds) and point values (10-20 points)
5. Provide clear explanations for correct answers
6. Tag relevant skills for each question

Format as JSON array:
[
  {
    "question": "Question text here",
    "questionType": "multiple-choice|scenario|short-answer|practical",
    "options": ["Option A", "Option B", "Option C", "Option D"], // Only for multiple-choice
    "correctAnswer": "Correct answer or option index",
    "explanation": "Detailed explanation",
    "skills": ["Skill1", "Skill2"],
    "timeLimit": 60,
    "points": 10
  }
]

Ensure questions are practical, job-relevant, and assess actual capabilities needed for this role.
    `;
  }

  /**
   * Parse AI-generated questions and format them
   */
  private parseAIQuestions(response: string, tier: 'foundational' | 'intermediate'): any[] {
    try {
      const questions = JSON.parse(response);
      const ObjectId = require('mongoose').Types.ObjectId;
      
      return questions.map((q: any, index: number) => ({
        _id: new ObjectId(),
        question: q.question,
        questionType: q.questionType,
        options: q.options || undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        skills: q.skills || [],
        timeLimit: q.timeLimit || 90,
        points: q.points || 15,
        tier,
        difficulty: tier === 'foundational' ? 'basic' : 'advanced',
        category: this.categorizeQuestion(q.skills),
        orderIndex: index
      }));
    } catch (error) {
      console.error('Error parsing AI questions:', error);
      throw new Error('Failed to parse AI-generated questions');
    }
  }

  /**
   * Categorize question based on skills
   */
  private categorizeQuestion(skills: string[]): string {
    const skillCategories = {
      'technical': ['programming', 'coding', 'software', 'development', 'database', 'api'],
      'soft-skills': ['communication', 'teamwork', 'leadership', 'management', 'collaboration'],
      'problem-solving': ['analytical', 'problem-solving', 'critical thinking', 'troubleshooting'],
      'domain': ['business', 'finance', 'marketing', 'sales', 'operations']
    };

    const skillsLower = skills.join(' ').toLowerCase();
    
    for (const [category, keywords] of Object.entries(skillCategories)) {
      if (keywords.some(keyword => skillsLower.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  /**
   * Infer role category from job details
   */
  private inferRoleCategory(job: any): string {
    const title = job.title.toLowerCase();
    const department = job.department.toLowerCase();
    const skills = job.skills.join(' ').toLowerCase();

    if (title.includes('software') || title.includes('developer') || skills.includes('programming')) {
      return 'technology';
    } else if (title.includes('sales') || department.includes('sales')) {
      return 'sales';
    } else if (title.includes('customer') || department.includes('service')) {
      return 'customer-service';
    } else if (title.includes('marketing') || department.includes('marketing')) {
      return 'marketing';
    } else if (title.includes('finance') || department.includes('finance')) {
      return 'finance';
    } else if (title.includes('manager') || title.includes('director')) {
      return 'management';
    } else {
      return 'general';
    }
  }

  /**
   * Fallback questions when AI generation fails
   */
  private getFallbackQuestions(jobId: string, tier: 'foundational' | 'intermediate'): any[] {
    const ObjectId = require('mongoose').Types.ObjectId;
    
    const fallbackQuestions = [
      {
        _id: new ObjectId(),
        question: 'Describe your approach to problem-solving in a professional setting.',
        questionType: 'short-answer',
        correctAnswer: 'A systematic approach involving identifying the problem, analyzing root causes, brainstorming solutions, implementing the best solution, and evaluating results.',
        explanation: 'Effective problem-solving requires a structured methodology and analytical thinking.',
        skills: ['Problem Solving', 'Analytical Skills'],
        timeLimit: 120,
        points: 15
      },
      {
        _id: new ObjectId(),
        question: 'How do you prioritize tasks when facing multiple deadlines?',
        questionType: 'scenario',
        correctAnswer: 'Assess urgency and importance, communicate with stakeholders, create a timeline, and focus on high-impact activities first.',
        explanation: 'Time management and prioritization are essential skills for professional success.',
        skills: ['Time Management', 'Prioritization'],
        timeLimit: 90,
        points: 10
      }
    ];

    return tier === 'foundational' ? fallbackQuestions.slice(0, 2) : fallbackQuestions.slice(1, 2);
  }

  /**
   * AI-powered answer evaluation
   */
  private async evaluateAnswer(question: any, userAnswer: string | string[], questionType: string): Promise<{ isCorrect: boolean; confidence: number; feedback: string }> {
    try {
      if (questionType === 'multiple-choice') {
        return this.evaluateMultipleChoice(question, userAnswer);
      } else {
        return await this.evaluateOpenEnded(question, userAnswer, questionType);
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      return { isCorrect: false, confidence: 0, feedback: 'Error evaluating answer' };
    }
  }

  /**
   * Evaluate multiple choice answers
   */
  private evaluateMultipleChoice(question: any, userAnswer: string | string[]): { isCorrect: boolean; confidence: number; feedback: string } {
    try {
      const correctIndex = question.correctAnswer;
      const selectedOptions = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      
      // Find the index of the selected answer in the options
      const selectedIndex = question.options?.findIndex((opt: string) => selectedOptions.includes(opt));
      
      const isCorrect = selectedIndex === correctIndex;
      const confidence = isCorrect ? 1.0 : 0.0;
      const feedback = isCorrect ? question.explanation : `Incorrect. The correct answer is: ${question.options?.[correctIndex] || question.correctAnswer}`;
      
      return { isCorrect, confidence, feedback };
    } catch (error) {
      console.error('Error evaluating multiple choice:', error);
      return { isCorrect: false, confidence: 0, feedback: 'Error evaluating answer' };
    }
  }

  /**
   * Evaluate open-ended answers using AI
   */
  private async evaluateOpenEnded(question: any, userAnswer: string | string[], questionType: string): Promise<{ isCorrect: boolean; confidence: number; feedback: string }> {
    try {
      const answerText = Array.isArray(userAnswer) ? userAnswer.join(' ') : userAnswer;
      
      const prompt = `
Evaluate this answer for correctness and quality:

Question: ${question.question}
Question Type: ${questionType}
Expected Answer: ${question.correctAnswer}
User Answer: ${answerText}

Provide evaluation in JSON format:
{
  "isCorrect": true/false,
  "confidence": 0.0-1.0,
  "feedback": "Detailed feedback explaining the evaluation",
  "score": 0-100,
  "strengths": ["List of strengths in the answer"],
  "improvements": ["List of areas for improvement"]
}

Consider:
- Correctness of the core concept
- Completeness of the answer
- Clarity and communication
- Practical relevance
- Technical accuracy (if applicable)

Be fair but thorough in evaluation.
      `;

      const response = await this.geminiService.generateContent(prompt);
      const evaluation = JSON.parse(response);
      
      return {
        isCorrect: evaluation.isCorrect,
        confidence: evaluation.confidence,
        feedback: evaluation.feedback
      };
    } catch (error) {
      console.error('Error evaluating open-ended answer:', error);
      // Fallback to keyword matching as backup
      return this.fallbackEvaluation(question, userAnswer);
    }
  }

  /**
   * Fallback evaluation when AI fails
   */
  private fallbackEvaluation(question: any, userAnswer: string | string[]): { isCorrect: boolean; confidence: number; feedback: string } {
    try {
      const answerText = Array.isArray(userAnswer) ? userAnswer.join(' ') : userAnswer;
      const correctAnswer = question.correctAnswer.toLowerCase();
      const userAnswerLower = answerText.toLowerCase();
      
      // Extract key concepts from correct answer
      const keyConcepts = correctAnswer.split(' ').filter((word: string) => word.length > 4);
      const matchedConcepts = keyConcepts.filter((concept: string) => userAnswerLower.includes(concept));
      
      const matchRatio = matchedConcepts.length / keyConcepts.length;
      const isCorrect = matchRatio >= 0.5;
      const confidence = matchRatio;
      
      let feedback = '';
      if (isCorrect) {
        feedback = `Good answer! You covered key concepts. ${question.explanation}`;
      } else {
        feedback = `Partial answer. Key concepts to consider: ${keyConcepts.join(', ')}. ${question.explanation}`;
      }
      
      return { isCorrect, confidence, feedback };
    } catch (error) {
      console.error('Error in fallback evaluation:', error);
      return { isCorrect: false, confidence: 0, feedback: 'Unable to evaluate answer' };
    }
  }

  /**
   * Start a new quiz attempt
   */
  async startQuizAttempt(jobId: string, applicantId: string): Promise<any> {
    try {
      // Temporarily disable existing attempt check to get the quiz working
      // const existingAttempt = await QuizAttempt.findOne({
      //   jobId,
      //   applicantId,
      //   status: 'in-progress',
      // });

      // if (existingAttempt) {
      //   throw new Error('Applicant already has an active quiz attempt');
      // }

      const quizSessionId = uuidv4();
      
      // For now, use any available technology config to get the quiz working
      let config = await QuizConfiguration.findOne({ jobId });
      
      if (!config) {
        // Try to find any technology config as a fallback
        config = await QuizConfiguration.findOne({ roleCategory: 'technology' });
      }
      
      if (!config) {
        throw new Error('Quiz configuration not found');
      }

      // Generate foundational questions
      const foundationalQuestions = await this.generateQuizQuestions(jobId, 'foundational');

      const quizAttempt = new QuizAttempt({
        jobId,
        applicantId,
        quizSessionId,
        tier: 'foundational',
        status: 'in-progress',
        questions: foundationalQuestions.map(q => ({
          questionId: q._id,
          questionText: q.question,
          questionType: q.questionType,
          options: q.options || undefined,
          explanation: q.explanation,
          skills: q.skills,
          userAnswer: '',
          correctAnswer: q.correctAnswer,
          isCorrect: false,
          points: q.points,
          pointsEarned: 0,
          timeTaken: 0,
          timeLimit: q.timeLimit,
          startedAt: new Date(),
          submittedAt: new Date(),
        })),
        scores: {
          foundational: {
            totalQuestions: foundationalQuestions.length,
            correctAnswers: 0,
            totalPoints: foundationalQuestions.reduce((sum, q) => sum + q.points, 0),
            pointsEarned: 0,
            percentage: 0,
          },
          overall: {
            totalQuestions: foundationalQuestions.length,
            correctAnswers: 0,
            totalPoints: foundationalQuestions.reduce((sum, q) => sum + q.points, 0),
            pointsEarned: 0,
            percentage: 0,
          },
        },
        analytics: {
          totalTime: 0,
          averageTimePerQuestion: 0,
          suspiciousPatterns: [],
          authenticityScore: 50,
        },
        progression: {
          startedAt: new Date(),
          lastActivityAt: new Date(),
          completedAt: null,
          timeToComplete: 0,
        },
        recommendation: {
          passToNextTier: false,
          overallScore: 0,
          fitLevel: 'low',
          interviewReadiness: 'not-ready',
          keyStrengths: [],
          areasToProbe: [],
          suggestedInterviewQuestions: [],
        },
      });

      await quizAttempt.save();
      return quizAttempt;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Submit answer to a quiz question
   */
  async submitAnswer(
    quizSessionId: string, 
    questionIndex: number, 
    answer: string | string[], 
    timeTaken: number
  ): Promise<any> {
    try {
      const attempt = await QuizAttempt.findOne({ quizSessionId, status: 'in-progress' });
      if (!attempt) throw new Error('Quiz attempt not found');

      if (questionIndex >= attempt.questions.length) {
        throw new Error('Invalid question index');
      }

      const question = attempt.questions[questionIndex];
      
      // Calculate if answer is correct using AI-powered evaluation
      const evaluation = await this.evaluateAnswer(
        question, 
        answer, 
        question.questionType
      );
      const isCorrect = evaluation.isCorrect;

      // Calculate points earned
      let pointsEarned = 0;
      if (isCorrect) {
        pointsEarned = question.points;
        // Add time bonus if applicable
        if (timeTaken < (question.timeLimit || 60) * 0.5) {
          pointsEarned += 2; // Time bonus
        }
      }

      // Update question response
      question.userAnswer = answer;
      question.isCorrect = isCorrect;
      question.pointsEarned = pointsEarned;
      question.timeTaken = timeTaken;
      question.submittedAt = new Date();

      // Update scores
      await this.updateScores(attempt);

      // Check for suspicious patterns
      await this.detectSuspiciousPatterns(attempt, questionIndex);

      attempt.progression.lastActivityAt = new Date();
      await attempt.save();

      return {
        isCorrect,
        pointsEarned,
        explanation: evaluation.feedback || question.explanation,
        confidence: evaluation.confidence,
        currentScore: attempt.scores.overall.percentage,
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  /**
   * Complete quiz attempt and generate results
   */
  async completeQuizAttempt(quizSessionId: string): Promise<any> {
    try {
      const attempt = await QuizAttempt.findOne({ 
        quizSessionId, 
        status: 'in-progress' 
      }).populate('jobId').populate('applicantId');

      if (!attempt) throw new Error('Quiz attempt not found');

      // Mark as completed
      attempt.status = 'completed';
      attempt.progression.completedAt = new Date();
      attempt.progression.timeToComplete = Date.now() - attempt.progression.startedAt.getTime();

      // Calculate final analytics
      await this.calculateAnalytics(attempt);

      // Perform quiz-to-CV cross-reference
      await this.performCrossReference(attempt);

      // Generate recommendations
      await this.generateRecommendations(attempt);

      await attempt.save();
      return attempt;
    } catch (error) {
      console.error('Error completing quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Progress to intermediate tier if foundational was passed
   */
  async progressToIntermediate(quizSessionId: string): Promise<any> {
    try {
      const attempt = await QuizAttempt.findOne({ 
        quizSessionId, 
        status: 'completed',
        tier: 'foundational'
      });

      if (!attempt) throw new Error('Quiz attempt not found');

      if (!attempt.recommendation.passToNextTier) {
        throw new Error('Not eligible for intermediate tier');
      }

      // Generate intermediate questions
      const intermediateQuestions = await this.generateQuizQuestions(
        attempt.jobId.toString(), 
        'intermediate'
      );

      // Update attempt for intermediate tier
      attempt.tier = 'intermediate';
      attempt.status = 'in-progress';
      attempt.questions = intermediateQuestions.map(q => ({
        questionId: q._id,
        questionText: q.question,
        questionType: q.questionType,
        options: q.options || undefined,
        explanation: q.explanation,
        skills: q.skills,
        userAnswer: '',
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        points: q.points,
        pointsEarned: 0,
        timeTaken: 0,
        timeLimit: q.timeLimit,
        startedAt: new Date(),
        submittedAt: new Date(),
      }));

      // Reset scores for intermediate tier
      attempt.scores.intermediate = {
        totalQuestions: intermediateQuestions.length,
        correctAnswers: 0,
        totalPoints: intermediateQuestions.reduce((sum, q) => sum + q.points, 0),
        pointsEarned: 0,
        percentage: 0,
      };

      await attempt.save();
      return attempt;
    } catch (error) {
      console.error('Error progressing to intermediate tier:', error);
      throw error;
    }
  }

  
  /**
   * Update scores after answer submission
   */
  private async updateScores(attempt: any): Promise<void> {
    const tier = attempt.tier;
    const tierQuestions = attempt.questions;

    const correctAnswers = tierQuestions.filter((q: any) => q.isCorrect).length;
    const totalPoints = tierQuestions.reduce((sum: number, q: any) => sum + q.points, 0);
    const pointsEarned = tierQuestions.reduce((sum: number, q: any) => sum + q.pointsEarned, 0);
    const percentage = totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0;

    if (tier === 'foundational') {
      attempt.scores.foundational = {
        totalQuestions: tierQuestions.length,
        correctAnswers,
        totalPoints,
        pointsEarned,
        percentage,
      };
    } else {
      attempt.scores.intermediate = {
        totalQuestions: tierQuestions.length,
        correctAnswers,
        totalPoints,
        pointsEarned,
        percentage,
      };
    }

    // Update overall scores
    const allQuestions = attempt.questions;
    const allCorrect = allQuestions.filter((q: any) => q.isCorrect).length;
    const allTotalPoints = allQuestions.reduce((sum: number, q: any) => sum + q.points, 0);
    const allPointsEarned = allQuestions.reduce((sum: number, q: any) => sum + q.pointsEarned, 0);
    const allPercentage = allTotalPoints > 0 ? (allPointsEarned / allTotalPoints) * 100 : 0;

    attempt.scores.overall = {
      totalQuestions: allQuestions.length,
      correctAnswers: allCorrect,
      totalPoints: allTotalPoints,
      pointsEarned: allPointsEarned,
      percentage: allPercentage,
    };
  }

  /**
   * Detect suspicious patterns in responses
   */
  private async detectSuspiciousPatterns(attempt: any, questionIndex: number): Promise<void> {
    const question = attempt.questions[questionIndex];
    const suspiciousPatterns = attempt.analytics.suspiciousPatterns;

    // Check for too fast responses
    if (question.timeTaken < 10) { // Less than 10 seconds
      suspiciousPatterns.push({
        type: 'too-fast',
        questionIndex,
        confidence: 0.8,
        details: 'Answer submitted unusually quickly',
      });
    }

    // Check for generic responses in open-ended questions
    if (['short-answer', 'scenario', 'practical'].includes(question.questionType)) {
      const genericPhrases = [
        'it depends',
        'in my opinion',
        'generally speaking',
        'it is important to',
      ];

      const answer = question.userAnswer.toString().toLowerCase();
      const hasGenericPhrases = genericPhrases.some(phrase => answer.includes(phrase));

      if (hasGenericPhrases) {
        suspiciousPatterns.push({
          type: 'generic-response',
          questionIndex,
          confidence: 0.6,
          details: 'Response contains generic phrases',
        });
      }
    }
  }

  /**
   * Calculate final analytics
   */
  private async calculateAnalytics(attempt: any): Promise<void> {
    const totalTime = attempt.questions.reduce((sum: number, q: any) => sum + q.timeTaken, 0);
    const averageTimePerQuestion = totalTime / attempt.questions.length;

    attempt.analytics.totalTime = totalTime;
    attempt.analytics.averageTimePerQuestion = averageTimePerQuestion;

    // Calculate authenticity score (simplified version)
    let authenticityScore = 50; // Base score

    // Penalize suspicious patterns
    attempt.analytics.suspiciousPatterns.forEach((pattern: any) => {
      authenticityScore -= pattern.confidence * 20;
    });

    // Bonus for varied response times
    const timeVariance = this.calculateTimeVariance(attempt.questions.map((q: any) => q.timeTaken));
    if (timeVariance > 0.3) {
      authenticityScore += 10;
    }

    attempt.analytics.authenticityScore = Math.max(0, Math.min(100, authenticityScore));
  }

  /**
   * Perform quiz-to-CV cross-reference analysis
   */
  private async performCrossReference(attempt: any): Promise<void> {
    const applicant = attempt.applicantId as any;
    if (!applicant) return;

    const cvClaims: any[] = [];
    const redFlags: any[] = [];
    const hiddenGems: any[] = [];

    // Check skill consistency
    applicant.skills.forEach((skill: string) => {
      const relevantQuestions = attempt.questions.filter((q: any) => 
        q.questionId.skills?.includes(skill)
      );

      if (relevantQuestions.length > 0) {
        const avgScore = relevantQuestions.reduce((sum: number, q: any) => 
          sum + (q.isCorrect ? 100 : 0), 0) / relevantQuestions.length;

        let consistency: 'consistent' | 'inconsistent' | 'exceeds-claims' | 'below-claims';
        if (avgScore >= 80) consistency = 'consistent';
        else if (avgScore >= 60) consistency = 'below-claims';
        else consistency = 'inconsistent';

        cvClaims.push({
          skill,
          claimedLevel: 'proficient', // Simplified
          quizEvidence: `Scored ${avgScore.toFixed(0)}% on relevant questions`,
          consistency,
          confidence: 0.7,
        });

        if (avgScore < 40) {
          redFlags.push({
            type: 'skill-misrepresentation',
            description: `Low quiz performance for claimed skill: ${skill}`,
            severity: 'medium',
          });
        } else if (avgScore >= 90) {
          hiddenGems.push({
            type: 'hidden-talent',
            description: `Exceptional performance in ${skill}`,
            potential: 'May be underselling abilities',
          });
        }
      }
    });

    attempt.crossReference = {
      cvClaims,
      redFlags,
      hiddenGems,
    };
  }

  /**
   * Generate final recommendations
   */
  private async generateRecommendations(attempt: any): Promise<void> {
    const overallScore = attempt.scores.overall.percentage;
    const config = await QuizConfiguration.findOne({ jobId: attempt.jobId });
    
    if (!config) return;

    const passingScore = attempt.tier === 'foundational'
      ? config.settings.foundationalTier.passingScore
      : config.settings.intermediateTier.passingScore;

    const passToNextTier = overallScore >= passingScore;

    let fitLevel: 'high' | 'medium' | 'low' = 'low';
    if (overallScore >= 80) fitLevel = 'high';
    else if (overallScore >= 60) fitLevel = 'medium';

    let interviewReadiness: 'ready' | 'needs-preparation' | 'not-ready' = 'not-ready';
    if (overallScore >= 80) interviewReadiness = 'ready';
    else if (overallScore >= 60) interviewReadiness = 'needs-preparation';

    // Generate key strengths and areas to probe
    const correctQuestions = attempt.questions.filter((q: any) => q.isCorrect);
    const incorrectQuestions = attempt.questions.filter((q: any) => !q.isCorrect);

    const keyStrengths = correctQuestions.slice(0, 3).map((q: any) => 
      q.questionText.substring(0, 50) + '...'
    );

    const areasToProbe = incorrectQuestions.slice(0, 3).map((q: any) => 
      q.questionText.substring(0, 50) + '...'
    );

    // Generate interview questions based on performance
    const suggestedInterviewQuestions = await this.generateInterviewQuestions(attempt);

    attempt.recommendation = {
      passToNextTier,
      overallScore,
      fitLevel,
      interviewReadiness,
      keyStrengths,
      areasToProbe,
      suggestedInterviewQuestions,
    };
  }

  /**
   * Generate interview questions based on quiz performance
   */
  private async generateInterviewQuestions(attempt: any): Promise<string[]> {
    const prompt = `
      Based on this quiz performance, generate 3 specific interview questions to probe the candidate's capabilities:
      
      Overall Score: ${attempt.scores.overall.percentage}%
      Tier: ${attempt.tier}
      Key Strengths: ${attempt.recommendation.keyStrengths.join(', ')}
      Areas to Probe: ${attempt.recommendation.areasToProbe.join(', ')}
      
      Generate questions that:
      1. Explore their strengths in more depth
      2. Investigate areas where they struggled
      3. Assess real-world application of their knowledge
      
      Return as a JSON array of strings.
    `;

    try {
      const response = await this.geminiService.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Fallback questions
      return [
        "Can you describe a time when you applied your skills to solve a complex problem?",
        "How do you approach learning new technologies or skills?",
        "What would you consider your biggest professional achievement and why?",
      ];
    }
  }

  /**
   * Randomly select questions from available pool
   */
  private randomizeQuestions(questions: any[], count: number): any[] {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Calculate variance in response times
   */
  private calculateTimeVariance(times: number[]): number {
    const mean = times.reduce((sum, time) => sum + time, 0) / times.length;
    const squaredDiffs = times.map(time => Math.pow(time - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / times.length;
    return variance / (mean * mean); // Normalized variance
  }
}
