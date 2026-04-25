const mongoose = require('mongoose');
const { connectDB } = require('./dist/utils/database');
const Job = require('./dist/models/job').Job;
const Applicant = require('./dist/models/applicant').Applicant;
const QuizConfiguration = require('./dist/models/quizConfiguration').QuizConfiguration;
const QuizQuestion = require('./dist/models/quizQuestion').QuizQuestion;

async function seedQuizData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // 1. Clear existing data
    await Job.deleteMany({});
    await Applicant.deleteMany({});
    await QuizConfiguration.deleteMany({});
    console.log('Cleared existing data');
    
    // 2. Create a job
    const job = new Job({
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
    console.log('✅ Job created:', job.title, '(ID:', job._id, ')');
    
    // 3. Create an applicant
    const applicant = new Applicant({
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
    console.log('✅ Applicant created:', applicant.name, '(ID:', applicant._id, ')');
    
    // 4. Create quiz configuration with only 2 questions (since we only have 2 available)
    const config = new QuizConfiguration({
      jobId: job._id,
      roleCategory: 'technology',
      isActive: true,
      settings: {
        foundationalTier: {
          questionCount: 2, // Match available questions
          passingScore: 70,
          timeLimit: 600,
          randomizeQuestions: true,
          preventRetake: true
        },
        intermediateTier: {
          questionCount: 3,
          passingScore: 75,
          timeLimit: 900,
          randomizeQuestions: true
        },
        scoring: {
          weights: {
            correctAnswer: 10,
            partialCredit: 5,
            timeBonus: 2
          },
          penalties: {
            wrongAnswer: 0,
            timeout: 0
          }
        },
        security: {
          detectSuspiciousPatterns: true,
          flagCopyPaste: false,
          trackResponseTime: true,
          preventTabSwitch: false
        }
      },
      questionFilters: {
        difficulty: ['foundational', 'intermediate'],
        questionTypes: ['multiple-choice', 'scenario'],
        skills: [],
        localContextOnly: false,
        languagePreference: ['english']
      },
      customInstructions: '',
      welcomeMessage: 'Welcome to the quiz! Please answer the following questions to the best of your ability.',
      completionMessage: 'Thank you for completing the quiz!'
    });
    
    await config.save();
    console.log('✅ Quiz configuration created');
    
    // 5. Verify quiz questions
    const questions = await QuizQuestion.find({ 
      roleCategory: 'technology', 
      difficulty: 'foundational', 
      isActive: true 
    });
    console.log('✅ Found', questions.length, 'technology foundational questions');
    
    console.log('\n🎯 Ready to test the quiz!');
    console.log('📱 Frontend Quiz URL:');
    console.log(`http://localhost:3000/quiz?jobId=${job._id}&applicantId=${applicant._id}`);
    console.log('\n📋 Quiz Start Request:');
    console.log(JSON.stringify({
      jobId: job._id,
      applicantId: applicant._id
    }, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

seedQuizData();
