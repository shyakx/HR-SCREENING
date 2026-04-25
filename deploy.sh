#!/bin/bash

echo "🚀 HR Screening System Deployment Script"
echo "======================================"

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
    echo "✅ $1 is installed"
}

echo "🔍 Checking prerequisites..."
check_tool "node"
check_tool "npm"
check_tool "git"

# Check if user is logged in to Vercel
echo ""
echo "🌐 Checking Vercel login..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi
echo "✅ Logged in to Vercel"

# Check if user is logged in to Railway
echo "🔧 Checking Railway login..."
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please run: railway login"
    exit 1
fi
echo "✅ Logged in to Railway"

# Deploy frontend
echo ""
echo "🌐 Deploying frontend to Vercel..."
cd frontend
vercel --prod

# Deploy backend
echo ""
echo "🔧 Deploying backend to Railway..."
cd ../backend
railway up

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel and Railway"
echo "2. Set up MongoDB Atlas database"
echo "3. Get Gemini API key from Google AI Studio"
echo "4. Update environment variables with your credentials"
echo "5. Seed the production database"
echo "6. Test your deployed application"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
