#!/bin/bash

# Script to push frontend build directory to GitHub
# Run this from the project root

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║         Push Frontend Build Directory to GitHub                        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

cd /home/nadeeshame/IdeaProjects/Hotel_Management_System/cinema-manager

echo "Step 1: Checking build directory exists..."
if [ -d "frontend/build" ]; then
    echo "✅ Build directory exists"
    ls frontend/build/
else
    echo "❌ Build directory not found. Building now..."
    cd frontend && npm run build && cd ..
fi

echo ""
echo "Step 2: Force adding build directory to Git..."
git add -f frontend/build/

echo ""
echo "Step 3: Adding .gitignore..."
git add .gitignore

echo ""
echo "Step 4: Checking staged files..."
git status

echo ""
echo "Step 5: Committing..."
git commit -m "Add frontend production build for deployment"

echo ""
echo "Step 6: Pushing to GitHub..."
git push origin master

echo ""
echo "✅ Done! Check your GitHub repository."
