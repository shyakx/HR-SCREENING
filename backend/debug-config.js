const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;

async function debugConfig() {
  try {
    await connectDB();
    
    const jobId = '69eceb4aa75a8fe17d73e892';
    console.log('Looking for config with jobId:', jobId);
    
    // Try as string
    let config = await QuizConfiguration.findOne({ jobId });
    console.log('Found with string jobId:', !!config);
    
    // Try as ObjectId
    const ObjectId = mongoose.Types.ObjectId;
    config = await QuizConfiguration.findOne({ jobId: new ObjectId(jobId) });
    console.log('Found with ObjectId:', !!config);
    
    // Show all configs
    const allConfigs = await QuizConfiguration.find({});
    console.log('All configs:', allConfigs.length);
    allConfigs.forEach(c => {
      console.log(`- JobId: ${c.jobId} (type: ${typeof c.jobId})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

debugConfig();
