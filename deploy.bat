@echo off
echo 🚀 HR Screening System Deployment Script
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install it first.
    pause
    exit /b 1
)
echo ✅ npm is installed

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
)
echo ✅ Vercel CLI is installed

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed. Installing...
    npm install -g @railway/cli
)
echo ✅ Railway CLI is installed

REM Check if user is logged in to Vercel
echo.
echo 🌐 Checking Vercel login...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Vercel. Please run: vercel login
    pause
    exit /b 1
)
echo ✅ Logged in to Vercel

REM Check if user is logged in to Railway
echo 🔧 Checking Railway login...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Railway. Please run: railway login
    pause
    exit /b 1
)
echo ✅ Logged in to Railway

REM Deploy frontend
echo.
echo 🌐 Deploying frontend to Vercel...
cd frontend
vercel --prod

REM Deploy backend
echo.
echo 🔧 Deploying backend to Railway...
cd ..\backend
railway up

echo.
echo 🎉 Deployment completed!
echo.
echo 📋 Next steps:
echo 1. Configure environment variables in Vercel and Railway
echo 2. Set up MongoDB Atlas database
echo 3. Get Gemini API key from Google AI Studio
echo 4. Update environment variables with your credentials
echo 5. Seed the production database
echo 6. Test your deployed application
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
pause
