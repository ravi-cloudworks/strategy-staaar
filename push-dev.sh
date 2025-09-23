#!/bin/bash

echo "🚀 Pushing to DEV branch..."

# Check if we're on dev branch, if not switch to it
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
    echo "📍 Switching to dev branch..."
    git checkout dev 2>/dev/null || git checkout -b dev
fi

# Add all changes
echo "📦 Adding all changes..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
    exit 0
fi

# Prompt for commit message
echo "💬 Enter commit message:"
read commit_message

# If no message provided, use default
if [ -z "$commit_message" ]; then
    commit_message="Update: $(date '+%Y-%m-%d %H:%M')"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_message"

# Push to dev branch
echo "🌍 Pushing to remote dev branch..."
git push origin dev

echo "✅ Successfully pushed to DEV branch!"
echo "🔗 Test your changes locally at: http://localhost:1967"
echo "🔗 Once deployed, staging will be available at your configured dev URL"