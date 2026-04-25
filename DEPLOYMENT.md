# Deploying RecruitHub to Production

This guide walks you through deploying RecruitHub to production using Vercel for the frontend and Railway for the backend.

## What You'll Need

- Node.js 18+ installed on your machine
- Git repository with the project code
- Accounts on these platforms:
  - [Vercel](https://vercel.com) for frontend hosting
  - [Railway](https://railway.app) for backend hosting
  - [MongoDB Atlas](https://mongodb.com/atlas) for database
  - [Google AI Studio](https://aistudio.google.com) for Gemini API key

## Project Structure

```
HR-SOLUTION/
├── frontend/          # Next.js web application
├── backend/           # Node.js API server
├── README.md
└── DEPLOYMENT.md      # This file
```

## Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Set Up Environment Variables
Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_APP_NAME=RecruitHub
NEXT_PUBLIC_APP_DESCRIPTION=Smart talent screening platform
```

### Step 3: Deploy to Vercel
```bash
cd frontend
vercel login
vercel --prod
```

### Step 4: Configure Project Settings
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings → Environment Variables**
4. Add these production variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_APP_NAME`: RecruitHub
   - `NEXT_PUBLIC_APP_DESCRIPTION`: Smart talent screening platform

## Backend Deployment (Railway)

### Step 1: Install Railway CLI
```bash
npm i -g @railway/cli
```

### Step 2: Set Up Environment Variables
Create `backend/.env`:
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr-screening?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-url.vercel.app
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
```

### Step 3: Deploy to Railway
```bash
cd backend
railway login
railway init
railway up
```

### Step 4: Configure Railway Service
1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Navigate to **Settings → Variables**
4. Add all environment variables from above
5. Configure **Deploy Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster (M0 free tier works for development)
3. Create a database user with strong password
4. Configure network access (allow all IPs for development)

### Step 2: Get Connection String
1. Go to **Database → Connect** in your Atlas dashboard
2. Select **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user's password

### Step 3: Update Environment Variables
Add the MongoDB URI to your Railway environment variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr-screening?retryWrites=true&w=majority
```

## AI Service Setup (Google Gemini)

### Step 1: Get Your API Key
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for your environment variables

### Step 2: Add API Key to Environment
Add the Gemini API key to your Railway environment variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Post-Deployment Steps

### Step 1: Seed Production Database
```bash
# Connect to your Railway service
railway shell

# Run the seed script
npm run seed
```

### Step 2: Verify Deployment
1. **Frontend**: Visit your Vercel URL and check the site loads
2. **Backend Health**: Visit `https://your-backend-url.railway.app/health`
3. **API Test**: Test a few API endpoints to ensure they work

### Step 3: Test the Application
1. Create a test job posting
2. Add some test applicants
3. Run AI screening to verify it works
4. Test all major features end-to-end

## Monitoring and Maintenance

### Health Check Endpoints
- **Health**: `/health` - Overall service status
- **Readiness**: `/health/ready` - Service readiness check
- **Liveness**: `/health/live` - Service liveness check
- **Metrics**: `/health/metrics` - Prometheus metrics

### Environment Variables Summary

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_APP_NAME=RecruitHub
NEXT_PUBLIC_APP_DESCRIPTION=Smart talent screening platform
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr-screening
FRONTEND_URL=https://your-frontend-url.vercel.app
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
```

## Troubleshooting

### Common Issues

#### Frontend Can't Connect to Backend
- Check CORS settings in the backend
- Verify API URL in frontend environment variables
- Ensure backend is running and accessible

#### Database Connection Failed
- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Ensure database user has proper permissions

#### AI Service Not Working
- Verify Gemini API key is valid
- Check API quota limits
- Review AI service logs for errors

#### Deployment Fails
- Check build logs for specific errors
- Verify all environment variables are set
- Ensure dependencies install correctly

### Debug Commands

#### Check Backend Health
```bash
curl https://your-backend-url.railway.app/health
```

#### Test Frontend Build
```bash
cd frontend
npm run build
```

#### Test Backend Build
```bash
cd backend
npm run build
```

## CI/CD Pipeline (Optional)

### GitHub Actions Setup
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy RecruitHub

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          working-directory: ./backend
```

## Performance Optimization

### Frontend Optimization
- Enable image optimization for faster loading
- Implement code splitting to reduce bundle size
- Use CDN for static assets
- Enable compression for better performance

### Backend Optimization
- Add database indexes for faster queries
- Implement caching for frequently accessed data
- Use connection pooling for database connections
- Monitor memory usage and optimize as needed

### Database Optimization
- Create proper indexes on search fields
- Monitor query performance regularly
- Implement data archiving for old records
- Set up regular automated backups

## Security Considerations

### Frontend Security
- Enable HTTPS for all connections
- Implement CSP headers for XSS protection
- Sanitize all user inputs
- Add rate limiting for API calls

### Backend Security
- Use environment variables for all secrets
- Implement rate limiting on API endpoints
- Validate all incoming data
- Monitor for suspicious activity

### Database Security
- Use strong authentication methods
- Enable encryption at rest
- Keep security updates current
- Implement access control lists

## Support

If you run into issues during deployment:

1. Check the logs in Vercel and Railway dashboards
2. Verify all environment variables are correctly set
3. Test health check endpoints to diagnose problems
4. Review this troubleshooting guide for common solutions

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas)
- [Google AI Documentation](https://ai.google.dev/docs)

---

**🎉 Your RecruitHub platform is now live and ready for production!**
