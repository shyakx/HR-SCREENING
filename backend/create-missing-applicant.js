const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const Applicant = require('./dist/models/applicant').Applicant;

async function createMissingApplicant() {
  try {
    await connectDB();
    
    // The exact applicantId the API is looking for
    const applicantId = '69eceb4aa75a8fe17d73e895';
    
    // Check if applicant exists
    const existing = await Applicant.findOne({ _id: new mongoose.Types.ObjectId(applicantId) });
    if (existing) {
      console.log('✅ Applicant already exists:', existing.name);
      process.exit(0);
    }
    
    // Create the applicant
    const applicant = new Applicant({
      _id: new mongoose.Types.ObjectId(applicantId),
      name: "Test Candidate",
      email: "test@example.com",
      phone: "+250788123456",
      location: "Kigali, Rwanda",
      experience: {
        years: 3,
        level: "mid"
      },
      skills: ["JavaScript", "React", "Node.js"],
      education: [
        {
          institution: "University of Rwanda",
          degree: "Bachelor's in Computer Science",
          field: "Computer Science",
          year: 2020
        }
      ],
      workHistory: [
        {
          company: "Tech Company",
          position: "Software Developer",
          duration: "2 years",
          description: "Developed web applications"
        }
      ],
      source: "external"
    });
    
    await applicant.save();
    console.log('✅ Created applicant with ID:', applicantId);
    
    // Verify it exists
    const found = await Applicant.findOne({ _id: new mongoose.Types.ObjectId(applicantId) });
    console.log('✅ Applicant found:', !!found);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createMissingApplicant();
