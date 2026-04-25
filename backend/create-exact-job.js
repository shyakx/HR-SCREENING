const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const Job = require('./dist/models/job').Job;

async function createExactJob() {
  try {
    await connectDB();
    
    // The exact jobId the API is looking for
    const jobId = '69eceb4aa75a8fe17d73e892';
    
    // Check if job exists
    const existing = await Job.findOne({ _id: new mongoose.Types.ObjectId(jobId) });
    if (existing) {
      console.log('✅ Job already exists:', existing.title);
      process.exit(0);
    }
    
    // Create the job with the exact ID
    const job = new Job({
      _id: new mongoose.Types.ObjectId(jobId),
      title: "Software Developer",
      description: "We are looking for a skilled software developer to join our team in Kigali.",
      requirements: [
        "3+ years of experience in software development",
        "Strong problem-solving skills",
        "Experience with modern web technologies"
      ],
      skills: ["JavaScript", "React", "Node.js", "Git", "TypeScript"],
      experienceLevel: "mid",
      location: "Kigali, Rwanda",
      department: "Technology",
      employmentType: "full-time",
      status: "active",
      roleCategory: "technology"
    });
    
    await job.save();
    console.log('✅ Created job with exact ID:', jobId);
    
    // Verify it exists
    const found = await Job.findOne({ _id: new mongoose.Types.ObjectId(jobId) });
    console.log('✅ Job found:', !!found);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createExactJob();
