#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║          Frontend Build Directory - Git Tracking Test                 ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

cd /home/nadeeshame/IdeaProjects/Hotel_Management_System

echo "📋 Testing .gitignore configuration..."
echo ""

# Test 1: Create test file
mkdir -p cinema-manager/frontend/build/static/js
touch cinema-manager/frontend/build/index.html
touch cinema-manager/frontend/build/static/js/main.js

echo "✅ Test files created"
echo ""

# Test 2: Check if ignored
echo "🔍 Test 1: Checking if files will be tracked..."
if git check-ignore cinema-manager/frontend/build/index.html > /dev/null 2>&1; then
    echo "❌ FAIL: index.html is still ignored"
    RESULT1="FAIL"
else
    echo "✅ PASS: index.html will be tracked"
    RESULT1="PASS"
fi

if git check-ignore cinema-manager/frontend/build/static/js/main.js > /dev/null 2>&1; then
    echo "❌ FAIL: JS files are still ignored"
    RESULT2="FAIL"
else
    echo "✅ PASS: JS files will be tracked"
    RESULT2="PASS"
fi

echo ""

# Test 3: Try to add
echo "🔍 Test 2: Trying to add files to Git..."
git add cinema-manager/frontend/build/ 2>&1 | grep -q "ignored" && RESULT3="FAIL" || RESULT3="PASS"

if [ "$RESULT3" = "PASS" ]; then
    echo "✅ PASS: Files can be added to Git"
else
    echo "❌ FAIL: Files cannot be added (still ignored)"
fi

echo ""

# Test 4: Check backend build is still ignored
mkdir -p cinema-manager/backend/target
touch cinema-manager/backend/target/app.jar

echo "🔍 Test 3: Verifying backend builds are still ignored..."
if git check-ignore cinema-manager/backend/target/app.jar > /dev/null 2>&1; then
    echo "✅ PASS: Backend builds are ignored (correct)"
    RESULT4="PASS"
else
    echo "❌ FAIL: Backend builds are NOT ignored (should be)"
    RESULT4="FAIL"
fi

# Cleanup
rm -rf cinema-manager/frontend/build/
rm -rf cinema-manager/backend/target/

# Reset git staging
git reset HEAD cinema-manager/ > /dev/null 2>&1

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "📊 Test Results Summary:"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "  Test 1 - Frontend build/index.html:     $RESULT1"
echo "  Test 2 - Frontend build/static/js:      $RESULT2"
echo "  Test 3 - Git add command:               $RESULT3"
echo "  Test 4 - Backend target/ still ignored: $RESULT4"
echo ""

if [ "$RESULT1" = "PASS" ] && [ "$RESULT2" = "PASS" ] && [ "$RESULT3" = "PASS" ] && [ "$RESULT4" = "PASS" ]; then
    echo "✅ ALL TESTS PASSED!"
    echo ""
    echo "🎉 Your .gitignore is configured correctly!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Build your frontend: cd cinema-manager/frontend && npm run build"
    echo "  2. Add to Git: git add cinema-manager/frontend/build/"
    echo "  3. Commit: git commit -m 'Add frontend build'"
    echo "  4. Push: git push origin master"
    echo ""
else
    echo "❌ SOME TESTS FAILED"
    echo ""
    echo "🔧 To fix:"
    echo "  1. Check .gitignore has these lines:"
    echo "     build/"
    echo "     !cinema-manager/frontend/build/"
    echo "     !cinema-manager/frontend/build/**"
    echo ""
    echo "  2. Clear Git cache:"
    echo "     git rm -r --cached cinema-manager/frontend/build/"
    echo ""
    echo "  3. Run this test again: ./test-gitignore.sh"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════════════════"
