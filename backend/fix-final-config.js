const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;

async function fixFinalConfig() {
  try {
    await connectDB();
    
    // The exact jobId the API is looking for
    const jobId = '69eceb4aa75a8fe17d73e892';
    
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
    
    // Verify it can be found
    const found = await QuizConfiguration.findOne({ jobId });
    console.log('✅ Config found with string jobId:', !!found);
    
    const foundWithObjectId = await QuizConfiguration.findOne({ jobId: new mongoose.Types.ObjectId(jobId) });
    console.log('✅ Config found with ObjectId:', !!foundWithObjectId);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixFinalConfig();
