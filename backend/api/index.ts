import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection removed for now - will connect per request

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'hr-screening-backend'
  });
});

// Database connection test
app.get('/api/test-db', async (req, res) => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      return res.status(500).json({
        success: false,
        message: 'MONGODB_URI not found in environment variables',
        env_vars: Object.keys(process.env).filter(k => k.includes('MONGO'))
      });
    }

    // Test connection
    const mongoose = require('mongoose');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    
    await mongoose.disconnect();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      host: conn.connection.host,
      mongoURI: mongoURI.replace(/\/\/.*@/, '//***:***@') // Hide credentials
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      mongoURI: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'NOT_FOUND'
    });
  }
});

// Mock data for testing (without database)
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "1",
        title: "Senior Frontend Developer",
        description: "Looking for an experienced frontend developer with React and TypeScript expertise",
        department: "Engineering",
        experienceLevel: "senior",
        location: "Remote",
        employmentType: "full-time",
        status: "active",
        requirements: ["5+ years experience", "React expertise", "TypeScript knowledge"],
        skills: ["React", "TypeScript", "Node.js", "CSS"],
        salaryRange: { min: 80000, max: 120000 },
        createdAt: new Date().toISOString()
      },
      {
        _id: "2",
        title: "Backend Developer",
        description: "Experienced backend developer for Node.js applications",
        department: "Engineering",
        experienceLevel: "mid",
        location: "New York",
        employmentType: "full-time",
        status: "active",
        requirements: ["3+ years experience", "Node.js expertise", "Database knowledge"],
        skills: ["Node.js", "MongoDB", "Express", "API Design"],
        salaryRange: { min: 70000, max: 100000 },
        createdAt: new Date().toISOString()
      }
    ],
    count: 2
  });
});

// Mock applicants endpoint
app.get('/api/applicants', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        experience: "5 years",
        skills: ["React", "TypeScript", "Node.js"],
        status: "screening",
        appliedFor: "Senior Frontend Developer",
        createdAt: new Date().toISOString()
      }
    ],
    count: 1
  });
});

// Mock screening endpoint
app.get('/api/screening', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "1",
        applicantId: "1",
        jobId: "1",
        status: "pending",
        score: 85,
        recommendation: "proceed",
        createdAt: new Date().toISOString()
      }
    ],
    count: 1
  });
});

// Routes (commented out until database is fixed)
// app.use('/api/jobs', jobRoutes);
// app.use('/api/applicants', applicantRoutes);
// app.use('/api/screening', screeningRoutes);

// Vercel serverless function handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
