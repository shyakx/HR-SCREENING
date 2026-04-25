const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;

async function fixConfigTo1() {
  try {
    await connectDB();
    
    // Update all quiz configurations to require only 1 question
    const result = await QuizConfiguration.updateMany(
      {},
      { 
        $set: { 
          'settings.foundationalTier.questionCount': 1
        }
      }
    );
    
    console.log('✅ Updated', result.modifiedCount, 'quiz configurations to require 1 question');
    
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

fixConfigTo1();
