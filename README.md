# HR Talent Screening System

An AI-powered talent screening system built for the Umurava AI Hackathon. This application helps recruiters efficiently screen and shortlist job applicants using Google's Gemini AI for intelligent candidate evaluation.

## Features

- **Job Management**: Create, edit, and manage job postings with detailed requirements
- **Applicant Management**: Upload and manage applicant profiles from multiple sources
- **AI-Powered Screening**: Use Gemini AI to analyze and rank candidates based on job requirements
- **Shortlist Generation**: Create and manage candidate shortlists with AI-generated reasoning
- **Dashboard Analytics**: Comprehensive overview of recruitment metrics and activities

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **React Hook Form**: Form handling
- **Lucide React**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Google Gemini API**: AI-powered candidate screening

### Deployment
- **Vercel**: Frontend hosting
- **Railway**: Backend hosting
- **MongoDB Atlas**: Database hosting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-solution
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend (.env)**:
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

   **Frontend (.env.local)**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Project Structure

```
hr-solution/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utility functions and API clients
│   │   ├── store/            # Redux store configuration
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── tsconfig.json
└── package.json              # Root package.json for running both apps
```

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applicants
- `GET /api/applicants` - Get all applicants
- `GET /api/applicants/:id` - Get applicant by ID
- `POST /api/applicants` - Create new applicant
- `PUT /api/applicants/:id` - Update applicant
- `DELETE /api/applicants/:id` - Delete applicant
- `POST /api/applicants/upload` - Upload applicants from CSV/Excel

### Screening
- `POST /api/screening/run` - Run AI screening for applicants
- `GET /api/screening/results/:jobId` - Get screening results for a job
- `GET /api/screening/shortlists` - Get all shortlists
- `POST /api/screening/shortlists` - Create new shortlist
- `GET /api/screening/shortlists/:id` - Get shortlist by ID
- `PUT /api/screening/shortlists/:id` - Update shortlist
- `DELETE /api/screening/shortlists/:id` - Delete shortlist

## AI Screening Process

The system uses Google's Gemini AI to evaluate candidates based on:

1. **Skills Alignment (40%)**: Matches candidate skills with job requirements
2. **Experience Relevance (30%)**: Evaluates experience level and relevance
3. **Education Background (15%)**: Considers educational qualifications
4. **Overall Fit (15%)**: Assesses general suitability for the role

For each candidate, the AI provides:
- **Match Score**: 0-100 score indicating overall fit
- **Rank**: Position in the candidate pool
- **Strengths**: Key positive attributes
- **Gaps**: Areas for improvement or missing requirements
- **Recommendation**: Hiring recommendation level
- **Reasoning**: Detailed explanation of the evaluation

## Data Schema

### Job Schema
```typescript
{
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  department: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'inactive' | 'closed';
}
```

### Applicant Schema
```typescript
{
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: {
    years: number;
    level: 'entry' | 'mid' | 'senior' | 'executive';
  };
  skills: string[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year: number;
  }[];
  workHistory: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  source: 'umurava' | 'external';
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Hackathon Requirements

This project was built for the Umurava AI Hackathon with the following requirements:

✅ **Mandatory Requirements**:
- Uses Google Gemini API for AI screening
- Implements both structured and unstructured data handling
- Provides explainable AI outputs with reasoning
- Maintains human-in-the-loop decision making
- Deployed and accessible online

✅ **Functional Requirements**:
- Job creation and management
- Applicant ingestion from multiple sources
- AI-based screening and ranking
- Shortlist generation and management
- Recruiter-friendly interface

✅ **Technical Requirements**:
- TypeScript implementation
- Next.js frontend
- Node.js backend
- MongoDB database
- Production-ready architecture

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support regarding this hackathon project:
- Team: [Your Team Name]
- Email: [Your Email]
- GitHub: [Your GitHub Profile]

---

**Built with ❤️ for the Umurava AI Hackathon**
