#!/bin/bash

# Deployment Helper Script
# This script helps you push your code to GitHub, which will trigger Vercel/Railway deployments.

echo "🚀 Starting Deployment Process..."

# 1. Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# 2. Add all files
echo "➕ Adding files to version control..."
git add .

# 3. Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Saudi Cable Dashboard Activation"

# 4. Prompt for Remote URL if missing
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ -z "$REMOTE_URL" ]; then
    echo "⚠️  No remote repository found."
    echo "👉 Please create a new repository on GitHub (https://github.com/new) and paste the URL here:"
    read -p "Repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
    echo "🔗 Remote added."
else
    echo "✅ Remote repository found: $REMOTE_URL"
fi

# 5. Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "🎉 Done! If Vercel/Railway are connected to this repo, your site is now building."
