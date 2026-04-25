const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const Job = require('./dist/models/job').Job;
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;
const QuizQuestion = require('./dist/models/quizQuestion').QuizQuestion;

async function debugAll() {
  try {
    await connectDB();
    
    console.log('=== JOBS ===');
    const jobs = await Job.find({});
    console.log('Jobs found:', jobs.length);
    jobs.forEach(job => {
      console.log(`- ${job.title} (${job._id}) - ${job.roleCategory}`);
    });
    
    if (jobs.length > 0) {
      const jobId = jobs[0]._id;
      console.log('\n=== QUIZ CONFIGURATION ===');
      const config = await QuizConfiguration.findOne({ jobId });
      if (config) {
        console.log('Config found:');
        console.log('- Role Category:', config.roleCategory);
        console.log('- Required Foundational Questions:', config.settings.foundationalTier.questionCount);
        console.log('- Passing Score:', config.settings.foundationalTier.passingScore);
      } else {
        console.log('No config found for job');
      }
      
      console.log('\n=== AVAILABLE QUESTIONS ===');
      const questions = await QuizQuestion.find({ 
        roleCategory: config?.roleCategory || 'technology', 
        difficulty: 'foundational', 
        isActive: true 
      });
      console.log('Available foundational questions:', questions.length);
      questions.forEach((q, i) => {
        console.log(`${i+1}. ${q.question.substring(0, 50)}...`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

debugAll();
