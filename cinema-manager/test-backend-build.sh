#!/bin/bash

# Cinema Management System - Backend Build & Test Script
# This script helps you verify the CORS fixes locally before deploying

echo "======================================"
echo "Cinema Management System - Build Test"
echo "======================================"
echo ""

# Navigate to backend directory
cd /home/nadeeshame/IdeaProjects/Hotel_Management_System/cinema-manager/backend

echo "📦 Building backend with Maven..."
./mvnw clean install -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 You can now run the backend with:"
    echo "   ./mvnw spring-boot:run"
    echo ""
    echo "📋 CORS Configuration:"
    echo "   The backend is configured to accept requests from:"
    echo "   - https://cinema-management-system-pbud-qlh8y0fgo.vercel.app"
    echo "   - https://cinema-management-system-tan.vercel.app"
    echo "   - http://localhost:3000"
    echo "   - http://localhost:3001"
    echo ""
    echo "🌐 To test locally:"
    echo "   1. Start backend: ./mvnw spring-boot:run"
    echo "   2. Visit: http://localhost:8081/api/health"
    echo "   3. Test CORS:"
    echo "      curl -X OPTIONS http://localhost:8081/api/auth/login \\"
    echo "        -H 'Origin: https://cinema-management-system-tan.vercel.app' \\"
    echo "        -H 'Access-Control-Request-Method: POST' \\"
    echo "        -v"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Deploy backend to Railway/Render/Heroku"
    echo "   2. Set CORS_ALLOWED_ORIGINS environment variable"
    echo "   3. Update REACT_APP_API_URL in Vercel"
    echo "   4. Test from production!"
    echo ""
    echo "📚 Documentation:"
    echo "   - DEPLOY_NOW.md - Quick deployment guide"
    echo "   - CORS_FIX_SUMMARY.md - What was fixed"
    echo "   - DEPLOYMENT_COMPLETE_GUIDE.md - Full guide"
    echo ""
else
    echo "❌ Build failed!"
    echo "Check the error messages above."
    exit 1
fi
