const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;

async function createCorrectConfig() {
  try {
    await connectDB();
    
    // The exact jobId the API is looking for
    const jobId = '69eceb4aa75a8fe17d73e892';
    
    // First, let's see if this config already exists
    const existing = await QuizConfiguration.findOne({ jobId: new mongoose.Types.ObjectId(jobId) });
    if (existing) {
      console.log('✅ Config already exists for jobId:', jobId);
      process.exit(0);
    }
    
    // Create the exact config the API needs
    const config = new QuizConfiguration({
      jobId: new mongoose.Types.ObjectId(jobId),
      roleCategory: 'technology',
      isActive: true,
      settings: {
        foundationalTier: {
          questionCount: 2,
          passingScore: 70,
          timeLimit: 600,
          randomizeQuestions: true,
          preventRetake: true
        },
        intermediateTier: {
          questionCount: 3,
          passingScore: 75,
          timeLimit: 900,
          randomizeQuestions: true
        },
        scoring: {
          weights: {
            correctAnswer: 10,
            partialCredit: 5,
            timeBonus: 2
          },
          penalties: {
            wrongAnswer: 0,
            timeout: 0
          }
        },
        security: {
          detectSuspiciousPatterns: true,
          flagCopyPaste: false,
          trackResponseTime: true,
          preventTabSwitch: false
        }
      },
      questionFilters: {
        difficulty: ['foundational', 'intermediate'],
        questionTypes: ['multiple-choice', 'scenario'],
        skills: [],
        localContextOnly: false,
        languagePreference: ['english']
      },
      customInstructions: '',
      welcomeMessage: 'Welcome to the quiz!',
      completionMessage: 'Thank you for completing the quiz!'
    });
    
    await config.save();
    console.log('✅ Created config for jobId:', jobId);
    
    // Verify it can be found with both string and ObjectId
    const found1 = await QuizConfiguration.findOne({ jobId });
    const found2 = await QuizConfiguration.findOne({ jobId: new mongoose.Types.ObjectId(jobId) });
    
    console.log('✅ Found with string jobId:', !!found1);
    console.log('✅ Found with ObjectId:', !!found2);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createCorrectConfig();
