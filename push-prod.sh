#!/bin/bash

echo "🚀 Deploying DEV to PRODUCTION..."

# Check if we're on dev branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
    echo "❌ Error: You must be on 'dev' branch to deploy to production"
    echo "📍 Current branch: $current_branch"
    echo "💡 Run: git checkout dev"
    exit 1
fi

# Check if dev branch is clean
if ! git diff --quiet; then
    echo "⚠️  Warning: You have uncommitted changes in dev branch"
    echo "💡 Please commit or stash changes first, then run this script again"
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

# Merge dev into main
echo "🔄 Merging dev branch into main..."
if git merge dev; then
    echo "✅ Merge successful!"
else
    echo "❌ Merge failed! Please resolve conflicts manually"
    echo "💡 After resolving conflicts, run: git commit && git push origin main"
    exit 1
fi

# Push to production
echo "🌍 Pushing to PRODUCTION (main branch)..."
git push origin main

echo ""
echo "🎉 SUCCESS! Deployed to PRODUCTION!"
echo "🔗 Production URL: https://ravi-cloudworks.github.io/strategy-staaar/"
echo "⏱️  Changes will be live in a few minutes"

# Switch back to dev branch for continued development
echo "📍 Switching back to dev branch for continued development..."
git checkout dev