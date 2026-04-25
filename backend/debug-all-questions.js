const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizQuestion = require('./dist/models/quizQuestion').QuizQuestion;

async function debugQuestions() {
  await connectDB();
  
  console.log('=== All questions in database ===');
  const allQuestions = await QuizQuestion.find({});
  console.log('Total questions:', allQuestions.length);
  allQuestions.forEach((q, i) => {
    console.log(`${i+1}. Role: ${q.roleCategory}, Difficulty: ${q.difficulty}, Active: ${q.isActive}`);
    console.log(`   Question: ${q.question.substring(0, 60)}...`);
  });
  
  console.log('\n=== Technology foundational questions ===');
  const techQuestions = await QuizQuestion.find({ 
    roleCategory: 'technology', 
    difficulty: 'foundational', 
    isActive: true 
  });
  console.log('Found:', techQuestions.length);
  
  process.exit(0);
}

debugQuestions();
