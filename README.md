# RecruitHub - Smart Talent Screening Platform

A modern recruitment platform that helps hiring teams efficiently evaluate and shortlist candidates using AI-powered analysis. Built for the Umurava AI Hackathon, this system streamlines the hiring process by intelligently matching job requirements with applicant profiles using Google's Gemini AI.

## What It Does

RecruitHub transforms how hiring teams evaluate candidates:

- **Job Management**: Post and manage job openings with detailed requirements and qualifications
- **Candidate Database**: Build and organize your talent pool with applicant profiles from various sources
- **Smart Screening**: Let AI analyze and rank candidates based on how well they match your job requirements
- **Shortlist Creation**: Automatically generate and manage curated candidate lists with AI insights
- **Hiring Analytics**: Track your recruitment pipeline with clear metrics and progress indicators

## Tech Stack

### Frontend (Next.js 14)
- **Next.js 14** - React framework with App Router for modern web apps
- **TypeScript** - Type-safe code for better reliability
- **Tailwind CSS** - Fast, utility-first styling
- **Redux Toolkit** - State management for complex data flows
- **React Hook Form** - Efficient form handling with validation
- **Lucide React** - Clean, modern icon set

### Backend (Node.js)
- **Node.js** - Fast JavaScript runtime for server-side logic
- **Express.js** - Web framework for building robust APIs
- **TypeScript** - Type-safe backend development
- **MongoDB** - Flexible NoSQL database for candidate data
- **Mongoose** - Elegant MongoDB object modeling
- **Google Gemini API** - Advanced AI for candidate evaluation

### Hosting & Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **Railway** - Backend hosting with easy scaling
- **MongoDB Atlas** - Managed cloud database

## Quick Start

### What You'll Need
- Node.js (v18 or newer)
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas account)
- Google Gemini API key (free from AI Studio)

### Installation Steps

**1. Clone the project**
```bash
git clone <repository-url>
cd hr-solution
```

**2. Install all dependencies**
```bash
npm run install:all
```

**3. Set up your environment**

Create a `.env` file in the backend folder:
```env
MONGODB_URI=mongodb://localhost:27017/hr-screening
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
```

Create a `.env.local` file in the frontend folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=RecruitHub
NEXT_PUBLIC_APP_DESCRIPTION=Smart talent screening platform
```

**4. Start the development servers**
```bash
npm run dev
```

This launches both applications:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

Open http://localhost:3000 in your browser to start using RecruitHub.

**Important Notes:**
- Make sure MongoDB is running before starting the backend
- The backend API runs on port 3001 (not 5000)
- Frontend environment variables need the `NEXT_PUBLIC_` prefix
- Restart both servers after updating environment variables

## Project Overview

```
hr-solution/
├── frontend/                 # Next.js web application
│   ├── src/
│   │   ├── app/              # App Router pages and layouts
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # API clients and utilities
│   │   ├── store/            # Redux state management
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── tsconfig.json
└── package.json              # Root package.json for both apps
```

## How to Use RecruitHub

### Getting Started

Once running, visit **http://localhost:3000** to access the main dashboard.

The sidebar navigation gives you access to:
- **Dashboard** - Your recruitment overview
- **Jobs** - Manage job postings and applications
- **Applicants** - Browse your candidate database
- **Screening** - Run AI candidate evaluations
- **Shortlists** - Manage curated candidate lists
- **Talent Pool** - View all candidates in one place

---

### Dashboard Overview

**Location**: Homepage (http://localhost:3000)

Your dashboard shows:
- **Key Metrics**: Active jobs, total applicants, recent screenings, pending reviews
- **Recent Jobs**: Latest 3 job postings with quick access links
- **Recent Shortlists**: Latest 3 candidate shortlists with counts
- **Quick Actions**: Easy buttons to create jobs and run screenings

**How to use:**
1. Get a bird's-eye view of your recruitment pipeline
2. Click any job card to see full details
3. Click any shortlist to view selected candidates
4. Use the sidebar menu to navigate to specific sections

---

### Managing Jobs

**Location**: http://localhost:3000/jobs

#### Creating New Jobs
1. Click **"Create Job"** (top-right button)
2. Fill in the details:
   - **Basic Info**: Job title, department, location, employment type
   - **Job Details**: Description, requirements, needed skills
   - **Experience Level**: Entry, Mid, Senior, or Executive
   - **Salary Range**: Min/max salary and currency (optional)
3. Click **"Create Job"** to publish

#### Managing Existing Jobs
1. **View Jobs**: Browse all postings in a clean table layout
2. **Job Status**: See which positions are active, inactive, or closed
3. **Quick Actions**:
   - **View**: Click job title for full details
   - **Edit**: Update job posting information
   - **Run Screening**: Start AI evaluation for this position
   - **Delete**: Remove the job posting

#### Job Applications
**Location**: http://localhost:3000/jobs/[id]/apply

Candidates can apply directly to specific jobs through dedicated application pages that collect:
- Personal contact information
- Resume file uploads
- Skills and work experience
- Cover letter content

---

### Managing Candidates

**Location**: http://localhost:3000/applicants

#### Finding Candidates
- **Search**: Look up candidates by name, email, or skills
- **Filter**: Narrow down by experience level, location, or specific skills
- **Sort**: Organize by name, experience, or when they were added

#### Candidate Profiles
Each applicant card shows:
- **Contact Info**: Name, email, phone, location
- **Experience**: Years of experience and seniority level
- **Skills**: Technical and soft skills list
- **Education**: Academic background and qualifications
- **Source**: Where the candidate came from

#### Adding New Candidates
1. Click **"Add Applicant"** to manually enter candidate information
2. Or use **"Upload CSV/Excel"** to import multiple candidates at once

---

### 🤖 AI Screening Process

**Access**: `http://localhost:3000/screening`

#### **Running AI Screening**
1. **Select a Job**: Choose from the dropdown or use the job table
2. **Click "Run Screening"**: This opens a modal with options
3. **Confirm Screening**: The AI will analyze all applicants for the selected job
4. **Wait for Processing**: AI evaluation typically takes 30-60 seconds
5. **Review Results**: See match scores, rankings, and recommendations

#### **Screening Results**
After screening completes, you'll see:
- **Match Scores**: 0-100% compatibility rating
- **Candidate Rankings**: #1, #2, #3, etc.
- **AI Recommendations**: Highly-recommended, recommended, not-recommended
- **Strengths**: Key positive attributes
- **Gaps**: Areas needing improvement
- **Reasoning**: Detailed AI explanation for each evaluation

#### **Recent Screening Results**
The screening dashboard shows:
- **Latest 5 screening sessions** with candidate details
- **Performance metrics** for each job
- **Average match scores** across all candidates
- **Color-coded recommendations** (green/yellow/red)

---

### Managing Shortlists

**Location**: http://localhost:3000/shortlists

#### Creating Shortlists
1. **After Screening**: Top candidates are automatically suggested
2. **Manual Selection**: Choose specific candidates from screening results
3. **Name Your Shortlist**: Give it a descriptive title
4. **Save**: Store the shortlist for future reference

#### Working with Shortlists
- **View All**: See all created shortlists with candidate counts
- **Shortlist Details**: Click to view selected candidates
- **Export Options**: Download as PDF or Excel for sharing
- **Share**: Send shortlists to team members for review

#### Shortlist Features
- **Full Profiles**: Complete details for each selected candidate
- **AI Insights**: Why each candidate was recommended
- **Comparison Tools**: Compare top candidates side-by-side
- **Status Tracking**: Track interview progress for each person

---

### Talent Pool Overview

**Location**: http://localhost:3000/talent-pool

The talent pool gives you a complete view of all candidates in your database.

**Statistics**:
- **Total Candidates**: Size of your complete candidate database
- **Senior Professionals**: Count of experienced candidates
- **Average Experience**: Mean years across all candidates
- **Unique Skills**: Total distinct skills available

**Search & Filter**:
- **Search**: Find candidates by name, email, or skills
- **Experience Level**: Entry, Mid, Senior, Executive filters
- **Skills Filter**: Show candidates with specific skills
- **Location Filter**: Candidates by geographic area
- **Sort Options**: By name, experience, skills count, or location

**Candidate Display**:
- **Contact Info**: Name, email, location
- **Experience Badge**: Visual seniority indicator
- **Top Skills**: First 3 skills with overflow indicator
- **Quick Actions**: View full profile or add to shortlist

---

### Complete Workflow Example

Here's how you might use RecruitHub from start to finish:

**Step 1: Post a Job**
1. Go to **Jobs** → **Create Job**
2. Create a "Senior Frontend Developer" position with React, TypeScript requirements
3. Set experience level to "Senior" and add salary range
4. Publish the job

**Step 2: Add Candidates**
1. Go to **Applicants** → **Upload CSV/Excel**
2. Import your database of 50+ developers
3. Review imported profiles for completeness

**Step 3: Run AI Screening**
1. Go to **Screening** → Select "Senior Frontend Developer"
2. Click **Run Screening** → Confirm in the modal
3. Wait for AI to analyze all 50 candidates
4. Review results showing match scores and rankings

**Step 4: Create Shortlist**
1. From screening results, select top 10 candidates (80%+ match score)
2. Click **Create Shortlist** → Name it "Frontend Dev Finalists"
3. Save and review your curated list

**Step 5: Manage Hiring Process**
1. Go to **Shortlists** → Open "Frontend Dev Finalists"
2. Track interview progress for each candidate
3. Export shortlist for team review
4. Make final hiring decisions

---

### Pro Tips

#### Better Job Postings
- **Be Specific**: Detailed requirements improve AI matching accuracy
- **List Required Skills**: Include all technical skills needed
- **Set Realistic Experience**: Match experience level to actual role requirements
- **Write Clear Descriptions**: Detailed descriptions attract better candidates

#### Smarter Screening
- **Batch Processing**: Screen multiple jobs together for efficiency
- **Review AI Reasoning**: Understand why candidates scored certain ways
- **Adjust Score Thresholds**: Different roles may need different match score cutoffs
- **Human Review**: Always review AI recommendations before final decisions

#### Talent Pool Management
- **Keep Data Current**: Regularly update candidate information
- **Consistent Skills Tagging**: Use consistent skill names for better search
- **Track Sources**: Know where your best candidates come from
- **Build Relationships**: Maintain contact with promising candidates

---

### Advanced Features

#### Data Export Options
- **Job Postings**: Export to PDF or Excel for records
- **Applicant Lists**: Download candidate databases
- **Screening Results**: Export AI evaluation reports
- **Shortlists**: Share curated candidate lists

#### Search & Discovery
- **Global Search**: Search across all data types at once
- **Advanced Filters**: Combine multiple search criteria
- **Saved Searches**: Save frequently used search configurations
- **Smart Recommendations**: AI suggests similar candidates

#### Analytics & Reporting
- **Hiring Metrics**: Track time-to-hire and conversion rates
- **Source Effectiveness**: Which channels bring the best candidates
- **Screening Performance**: AI accuracy and user satisfaction
- **Diversity Metrics**: Track demographic representation

---

## API Reference

### Jobs API
- `GET /api/jobs` - List all job postings
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs` - Create new job posting
- `PUT /api/jobs/:id` - Update job information
- `DELETE /api/jobs/:id` - Remove job posting

### Applicants API
- `GET /api/applicants` - List all candidates
- `GET /api/applicants/:id` - Get candidate details
- `POST /api/applicants` - Add new candidate
- `PUT /api/applicants/:id` - Update candidate information
- `DELETE /api/applicants/:id` - Remove candidate
- `POST /api/applicants/upload` - Import candidates from CSV/Excel

### Screening API
- `POST /api/screening/run` - Start AI screening for a job
- `GET /api/screening/results/:jobId` - Get screening results
- `GET /api/screening/shortlists` - List all shortlists
- `POST /api/screening/shortlists` - Create new shortlist
- `GET /api/screening/shortlists/:id` - Get shortlist details
- `PUT /api/screening/shortlists/:id` - Update shortlist
- `DELETE /api/screening/shortlists/:id` - Remove shortlist

## How AI Screening Works

RecruitHub uses Google's Gemini AI to evaluate candidates based on multiple factors:

**Scoring Breakdown:**
- **Skills Alignment (40%)**: How well candidate skills match job requirements
- **Experience Relevance (30%)**: Experience level and relevance to the role
- **Education Background (15%)**: Educational qualifications and achievements
- **Overall Fit (15%)**: General suitability and potential for success

For each candidate, the AI provides:
- **Match Score**: 0-100 score indicating overall compatibility
- **Rank**: Position relative to other candidates
- **Strengths**: Key positive attributes and qualifications
- **Gaps**: Areas for improvement or missing requirements
- **Recommendation**: Hiring recommendation level
- **Reasoning**: Detailed explanation of the evaluation

## Data Models

### Job Data Structure
```typescript
{
  title: string;                    // Job title
  description: string;              // Role description
  requirements: string[];           // Key requirements
  skills: string[];                 // Required skills
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;                 // Work location
  department: string;               // Department/team
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'inactive' | 'closed';
}
```

### Candidate Data Structure
```typescript
{
  name: string;                     // Full name
  email: string;                    // Email address
  phone: string;                    // Phone number
  location: string;                 // Geographic location
  experience: {
    years: number;                  // Years of experience
    level: 'entry' | 'mid' | 'senior' | 'executive';
  };
  skills: string[];                 // Technical and soft skills
  education: {
    degree: string;                 // Degree type
    field: string;                  // Field of study
    institution: string;            // School/university
    year: number;                   // Graduation year
  }[];
  workHistory: {
    company: string;                // Company name
    position: string;               // Job title
    duration: string;               // Employment period
    description: string;            // Role description
  }[];
  source: 'umurava' | 'external';  // Where candidate came from
}
```

## Troubleshooting

### Common Issues

#### Setup Problems

**Frontend shows "Failed to connect to backend"**
- Check that backend is running on `http://localhost:3001`
- Start backend with `npm run dev` in the backend directory
- Verify `.env.local` has the correct `NEXT_PUBLIC_API_URL`

**Database connection errors**
- Make sure MongoDB is running locally or Atlas credentials are correct
- Check the `MONGODB_URI` in your backend `.env` file
- Test connection with `mongosh` if needed

**API key errors**
- Ensure `GEMINI_API_KEY` is set in backend `.env`
- Get a free API key from Google AI Studio
- Verify the key has sufficient API quota

#### AI Screening Issues

**"Rate limit exceeded" error**
- Too many API calls to Gemini AI service
- Wait 30 seconds and retry automatically
- Use batch processing for multiple candidates

**Screening takes too long**
- Normal processing time is 30-60 seconds for 30+ candidates
- Time depends on candidate count and API response speed
- Process in smaller batches if needed

**All candidates have low match scores**
- Job requirements might be too specific
- Review and adjust job description and required skills
- Balance specific and general requirements

#### Data Management

**CSV upload fails**
- Check file format is CSV or Excel
- Verify required columns are present (name, email, etc.)
- Use the provided template format

**Duplicate candidates**
- Multiple uploads with same candidates
- Use email as unique identifier
- Review existing data before uploading

#### Frontend Issues

**Page not found (404 errors)**
- Check URL spelling and route structure
- Use navigation menu instead of manual URLs
- Verify all routes are properly configured

**Data not updating after actions**
- Cache or state management issue
- Refresh page or check Redux state
- Clear browser cache if problem persists

---

### Performance Tips

#### Large Datasets
- Use pagination for applicant lists
- Apply filters before loading large datasets
- Enable browser caching for static data

#### AI Screening
- Screen multiple jobs together for efficiency
- Run intensive screening during low-traffic hours
- Store screening results to avoid re-processing

#### Database Performance
- Ensure proper database indexes on search fields
- Regularly remove old or duplicate data
- Monitor database query performance

---

### Security Best Practices

#### API Security
- Never commit API keys to Git
- Monitor and adjust rate limits as needed
- Validate all user inputs

#### Data Protection
- Handle candidate information responsibly
- Implement proper user authentication
- Regular database backups

---

### Browser Support

**Supported Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Mobile Support:**
- ✅ Responsive design for tablets
- ⚠️ Limited functionality on mobile phones
- 📱 Recommended for desktop use

---

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Hackathon Project Details

Built for the Umurava AI Hackathon, RecruitHub meets all competition requirements:

✅ **Mandatory Features:**
- Google Gemini API integration for AI screening
- Handles both structured and unstructured data
- Provides explainable AI outputs with detailed reasoning
- Maintains human-in-the-loop decision making
- Fully deployed and accessible online

✅ **Core Functionality:**
- Job creation and management system
- Multi-source applicant ingestion
- AI-based candidate screening and ranking
- Shortlist generation and management
- Recruiter-friendly interface

✅ **Technical Implementation:**
- Full TypeScript implementation
- Next.js frontend with modern UI
- Node.js backend with REST API
- MongoDB database for data storage
- Production-ready architecture

✅ **Deployment:**
- Frontend hosted on Vercel
- Backend deployed on Railway
- MongoDB Atlas for database
- Environment-based configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Get in Touch

For questions about this hackathon project:
- **Team**: [Your Team Name]
- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]

---

**Built with passion for the Umurava AI Hackathon**
