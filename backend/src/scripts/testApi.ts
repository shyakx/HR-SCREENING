import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function testQuizAPI() {
  try {
    console.log('🚀 Testing Role Fit Quiz API...\n');

    // 1. Create a test job
    console.log('1️⃣ Creating test job...');
    const jobResponse = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
        status: "active"
      })
    });

    if (!jobResponse.ok) {
      throw new Error(`Failed to create job: ${jobResponse.statusText}`);
    }

    const job = await jobResponse.json() as ApiResponse<any>;
    console.log('✅ Job created:', job.data.title, '(ID:', job.data._id, ')');

    // 2. Create a test applicant
    console.log('\n2️⃣ Creating test applicant...');
    const applicantResponse = await fetch(`${API_BASE}/applicants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test Candidate",
        email: "test.candidate@example.com",
        phone: "+250788123456",
        location: "Kigali, Rwanda",
        experience: {
          years: 4,
          level: "mid"
        },
        skills: ["JavaScript", "React", "Node.js", "Git", "TypeScript", "MongoDB"],
        education: [
          {
            degree: "Bachelor of Science",
            field: "Computer Science",
            institution: "University of Rwanda",
            year: 2020
          }
        ],
        workHistory: [
          {
            company: "Tech Company Rwanda",
            position: "Software Developer",
            duration: "2 years",
            description: "Developed web applications using React and Node.js"
          }
        ],
        source: "external"
      })
    });

    if (!applicantResponse.ok) {
      throw new Error(`Failed to create applicant: ${applicantResponse.statusText}`);
    }

    const applicant = await applicantResponse.json() as ApiResponse<any>;
    console.log('✅ Applicant created:', applicant.data.name, '(ID:', applicant.data._id, ')');

    // 3. Create quiz configuration
    console.log('\n3️⃣ Creating quiz configuration...');
    const configResponse = await fetch(`${API_BASE}/quiz/config/${job.data._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roleCategory: 'technology',
        isActive: true,
        settings: {
          foundationalTier: {
            questionCount: 3,
            passingScore: 60,
            timeLimit: 600,
            randomizeQuestions: true,
            preventRetake: true
          },
          intermediateTier: {
            questionCount: 3,
            passingScore: 70,
            timeLimit: 900,
            randomizeQuestions: true
          }
        },
        welcomeMessage: 'Welcome to the Role Fit Check for Software Developer position!',
        completionMessage: 'Thank you for completing the assessment. We will review your responses and be in touch soon.'
      })
    });

    if (!configResponse.ok) {
      throw new Error(`Failed to create quiz config: ${configResponse.statusText}`);
    }

    const config = await configResponse.json();
    console.log('✅ Quiz configuration created');

    // 4. Get available quiz questions
    console.log('\n4️⃣ Checking available quiz questions...');
    const questionsResponse = await fetch(`${API_BASE}/quiz/questions?roleCategory=technology&difficulty=foundational`);
    
    if (!questionsResponse.ok) {
      throw new Error(`Failed to get questions: ${questionsResponse.statusText}`);
    }

    const questions = await questionsResponse.json() as ApiResponse<any>;
    console.log(`✅ Found ${questions.data.length} technology foundational questions`);

    // 5. Test quiz URLs
    console.log('\n🎯 Ready to test the quiz!');
    console.log('\n📱 Frontend Quiz URL:');
    console.log(`http://localhost:3000/quiz?jobId=${job.data._id}&applicantId=${applicant.data._id}`);
    
    console.log('\n🔍 API Endpoints you can test:');
    console.log(`- Start Quiz: POST ${API_BASE}/quiz/start`);
    console.log(`- Get Questions: GET ${API_BASE}/quiz/questions`);
    console.log(`- Quiz Config: GET ${API_BASE}/quiz/config/${job.data._id}`);
    
    console.log('\n📋 Sample quiz start request:');
    console.log(JSON.stringify({
      jobId: job.data._id,
      applicantId: applicant.data._id
    }, null, 2));

    console.log('\n✅ Quiz API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testQuizAPI();
