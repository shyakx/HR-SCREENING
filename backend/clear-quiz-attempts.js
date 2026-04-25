const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizAttempt = require('./dist/models/quizAttempt').QuizAttempt;

async function clearQuizAttempts() {
  try {
    await connectDB();
    
    // Delete all quiz attempts
    const result = await QuizAttempt.deleteMany({});
    console.log('✅ Cleared', result.deletedCount, 'quiz attempts');
    
    // Verify no attempts remain
    const count = await QuizAttempt.countDocuments({});
    console.log('✅ Remaining attempts:', count);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

clearQuizAttempts();
