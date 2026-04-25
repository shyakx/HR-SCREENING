const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;

async function createSimpleConfig() {
  try {
    await connectDB();
    
    // Delete existing config
    await QuizConfiguration.deleteMany({});
    
    // Create config with the exact jobId the API is using
    const jobId = '69eceb4aa75a8fe17d73e892';
    
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
    console.log('✅ Created simple config for jobId:', jobId);
    
    // Test finding it
    const found = await QuizConfiguration.findOne({ jobId });
    console.log('✅ Found config:', !!found);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createSimpleConfig();
