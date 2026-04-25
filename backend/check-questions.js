const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizQuestion = require('./dist/models/quizQuestion').QuizQuestion;

async function checkQuestions() {
  await connectDB();
  
  const techFoundational = await QuizQuestion.find({ 
    roleCategory: 'technology', 
    difficulty: 'foundational', 
    isActive: true 
  });
  
  console.log('Available technology foundational questions:', techFoundational.length);
  techFoundational.forEach((q, i) => {
    console.log(`${i+1}. ${q.question.substring(0, 50)}...`);
  });
  
  process.exit(0);
}

checkQuestions();
