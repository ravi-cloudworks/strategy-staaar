#!/bin/bash

echo "🚀 Deploying SECURE BUILD to PRODUCTION..."

# Build secure version first
echo "🔒 Building secure obfuscated version..."
if ! ./build-secure.sh; then
    echo "❌ Secure build failed"
    exit 1
fi

# Check if we're on dev branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
    echo "❌ Error: You must be on 'dev' branch to deploy to production"
    echo "📍 Current branch: $current_branch"
    echo "💡 Run: git checkout dev"
    exit 1
fi

# Check if dev branch is clean (dist folder should not be tracked)
if ! git diff --quiet; then
    echo "⚠️  Warning: You have uncommitted changes in dev branch"
    echo "💡 Please commit or stash changes first, then run this script again"
    git status --porcelain
    exit 1
fi

# Show what will be deployed
echo "📋 Changes that will be deployed to production:"
git log main..dev --oneline

echo ""
echo "🤔 Are you sure you want to deploy these changes to PRODUCTION? (y/N)"
read -r confirmation

if [[ ! $confirmation =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

# Switch to main branch
echo "📍 Switching to main branch..."
git checkout main

# Pull latest main to ensure we're up to date
echo "📥 Pulling latest main branch..."
git pull origin main

# Clear main branch (keep only git files)
echo "🧹 Clearing main branch for fresh deployment..."
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;

# Switch back to dev to build and copy files
echo "📍 Switching back to dev to copy build files..."
git checkout dev

# Copy secure build files to a temporary location
echo "📁 Copying secure build files..."
mkdir -p /tmp/deploy_temp
cp -r dist/* /tmp/deploy_temp/
cp -r dist/.[^.]* /tmp/deploy_temp/ 2>/dev/null || true

# Copy additional assets that index.html depends on
echo "📁 Copying additional assets..."
cp -r css /tmp/deploy_temp/ 2>/dev/null || echo "No css directory found"
cp -r data /tmp/deploy_temp/ 2>/dev/null || echo "No data directory found"
cp -r mockup-images /tmp/deploy_temp/ 2>/dev/null || echo "No mockup-images directory found"
cp -r videos /tmp/deploy_temp/ 2>/dev/null || echo "No videos directory found"

# Switch back to main and copy files
echo "📍 Switching to main branch..."
git checkout main

# Copy build files to main branch root
echo "📁 Adding secure build files to main branch root..."
cp -r /tmp/deploy_temp/* ./
cp -r /tmp/deploy_temp/.[^.]* ./ 2>/dev/null || true

# Clean up temp directory
rm -rf /tmp/deploy_temp

# Add secure build to staging area
echo "📁 Staging secure build files..."
git add .

# Commit secure build
echo "💾 Committing secure build..."
git commit -m "Deploy secure obfuscated build for production

🔒 Security features:
- Domain validation enabled
- JavaScript obfuscated
- Copyright notices added
- Ready for RLS deployment
- Source code secured in dev branch

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to production
echo "🌍 Pushing to PRODUCTION (main branch)..."
git push origin main

echo ""
echo "🎉 SUCCESS! Secure build deployed to PRODUCTION!"
echo "🔗 Production URL: https://ravi-cloudworks.github.io/strategy-staaar/"
echo "⏱️  Changes will be live in a few minutes"
echo ""
echo "🔒 SECURITY CHECKLIST - Complete these in Supabase Dashboard:"
echo "   1. Run SQL from supabase-rls-setup.sql in SQL Editor"
echo "   2. Auth → URL Configuration → Site URL: https://ravi-cloudworks.github.io"
echo "   3. Auth → Redirect URLs → Add only: https://ravi-cloudworks.github.io/**"
echo ""
echo "📱 LinkedIn OAuth Configuration:"
echo "   1. LinkedIn Developer Portal → Your App → Auth"
echo "   2. Remove all redirect URLs except GitHub Pages domain"
echo "   3. Test login flow after deployment"

# Switch back to dev branch for continued development
echo "📍 Switching back to dev branch for continued development..."
git checkout dev