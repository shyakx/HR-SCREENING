import mongoose from 'mongoose';
import { connectDB } from '../utils/database';
import { seedQuizQuestions } from '../data/sampleQuizQuestions';

async function testQuizSystem() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Seed sample questions
    await seedQuizQuestions();
    
    console.log('✅ Quiz system test completed successfully!');
    console.log('📝 Sample quiz questions have been added to the database');
    console.log('🚀 You can now test the quiz system by:');
    console.log('   1. Starting the backend server: npm run dev');
    console.log('   2. Starting the frontend server: cd ../frontend && npm run dev');
    console.log('   3. Navigating to: http://localhost:3000/quiz?jobId=<jobId>&applicantId=<applicantId>');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testQuizSystem();
