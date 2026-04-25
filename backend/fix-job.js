const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const Job = require('./dist/models/job').Job;

async function fixJob() {
  try {
    await connectDB();
    
    const job = await Job.findOne({ title: "Software Developer" });
    if (job) {
      job.roleCategory = "technology";
      await job.save();
      console.log('✅ Fixed job roleCategory:', job.roleCategory);
    } else {
      console.log('❌ Job not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixJob();
