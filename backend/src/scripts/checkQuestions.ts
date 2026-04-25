import mongoose from 'mongoose';
import { connectDB } from '../utils/database';
import { QuizQuestion } from '../models';

async function checkQuizQuestions() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Check all quiz questions
    const allQuestions = await QuizQuestion.find({});
    console.log(`\n📊 Total quiz questions in database: ${allQuestions.length}`);
    
    if (allQuestions.length > 0) {
      console.log('\n📝 Sample questions:');
      allQuestions.slice(0, 3).forEach((q, index) => {
        console.log(`${index + 1}. ${q.question}`);
        console.log(`   Category: ${q.roleCategory}, Difficulty: ${q.difficulty}`);
        console.log(`   Active: ${q.isActive}`);
        console.log('');
      });
    }
    
    // Check technology questions specifically
    const techQuestions = await QuizQuestion.find({ roleCategory: 'technology' });
    console.log(`\n💻 Technology questions: ${techQuestions.length}`);
    
    const foundationalTechQuestions = await QuizQuestion.find({ 
      roleCategory: 'technology', 
      difficulty: 'foundational',
      isActive: true 
    });
    console.log(`\n🎯 Active foundational technology questions: ${foundationalTechQuestions.length}`);
    
    if (foundationalTechQuestions.length > 0) {
      console.log('\n✅ Found questions that should work for the quiz!');
    } else {
      console.log('\n❌ No active foundational technology questions found');
      console.log('This might be why the quiz is not working properly');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkQuizQuestions();
