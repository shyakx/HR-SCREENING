const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;

async function fixAllConfigs() {
  try {
    await connectDB();
    
    // Update all quiz configurations to require only 2 questions
    const result = await QuizConfiguration.updateMany(
      {},
      { 
        $set: { 
          'settings.foundationalTier.questionCount': 2,
          'settings.foundationalTier.passingScore': 70
        }
      }
    );
    
    console.log('✅ Updated', result.modifiedCount, 'quiz configurations');
    
    // Verify the update
    const configs = await QuizConfiguration.find({});
    configs.forEach((config, i) => {
      console.log(`Config ${i+1}: Required questions = ${config.settings.foundationalTier.questionCount}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixAllConfigs();
