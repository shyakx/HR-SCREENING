const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizAttempt = require('./dist/models/quizAttempt').QuizAttempt;
const Applicant = require('./dist/models/applicant').Applicant;

async function debugApplicant() {
  try {
    await connectDB();
    
    const applicantId = '69eceb4aa75a8fe17d73e895';
    
    console.log('=== Checking applicant ===');
    const applicant = await Applicant.findOne({ _id: new mongoose.Types.ObjectId(applicantId) });
    console.log('Applicant found:', !!applicant);
    if (applicant) {
      console.log('Applicant name:', applicant.name);
    }
    
    console.log('\n=== Checking quiz attempts ===');
    const attempts = await QuizAttempt.find({ applicantId });
    console.log('Quiz attempts found:', attempts.length);
    attempts.forEach((attempt, i) => {
      console.log(`Attempt ${i+1}: ${attempt.quizSessionId}, Status: ${attempt.status}`);
    });
    
    // Clear any existing attempts for this applicant
    if (attempts.length > 0) {
      await QuizAttempt.deleteMany({ applicantId });
      console.log('✅ Cleared attempts for applicant');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

debugApplicant();
