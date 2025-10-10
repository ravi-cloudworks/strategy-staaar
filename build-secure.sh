#!/bin/bash

echo "🔒 Building secure production version..."

# Check if we're on dev branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
    echo "❌ Error: You must be on 'dev' branch to build secure version"
    echo "📍 Current branch: $current_branch"
    echo "💡 Run: git checkout dev"
    exit 1
fi

# Create dist directory for secure build
echo "📁 Creating dist directory..."
mkdir -p dist
mkdir -p dist/js
mkdir -p dist/mockups

# Check if javascript-obfuscator is installed
if ! command -v javascript-obfuscator &> /dev/null; then
    echo "🔧 Installing javascript-obfuscator..."
    npm install -g javascript-obfuscator
fi

# Check if html-minifier is installed
if ! command -v html-minifier &> /dev/null; then
    echo "🔧 Installing html-minifier..."
    npm install -g html-minifier
fi

# Obfuscate JavaScript files
echo "🔐 Obfuscating JavaScript files..."

# Main app files
javascript-obfuscator js/main.js \
  --output dist/js/main.js \
  --compact true \
  --control-flow-flattening true \
  --control-flow-flattening-threshold 0.75 \
  --dead-code-injection true \
  --dead-code-injection-threshold 0.4 \
  --string-array true \
  --string-array-encoding 'rc4' \
  --string-array-threshold 0.75 \
  --unicode-escape-sequence true

# Auth file (most critical)
javascript-obfuscator js/auth.js \
  --output dist/js/auth.js \
  --compact true \
  --control-flow-flattening true \
  --control-flow-flattening-threshold 0.9 \
  --dead-code-injection true \
  --dead-code-injection-threshold 0.6 \
  --string-array true \
  --string-array-encoding 'rc4' \
  --string-array-threshold 0.9 \
  --unicode-escape-sequence true

# Obfuscate all other JS files
for jsfile in js/*.js; do
    if [[ "$jsfile" != "js/main.js" && "$jsfile" != "js/auth.js" ]]; then
        filename=$(basename "$jsfile")
        echo "🔐 Obfuscating $filename..."
        javascript-obfuscator "$jsfile" \
          --output "dist/js/$filename" \
          --compact true \
          --control-flow-flattening true \
          --control-flow-flattening-threshold 0.75 \
          --dead-code-injection true \
          --dead-code-injection-threshold 0.4 \
          --string-array true \
          --string-array-encoding 'rc4' \
          --string-array-threshold 0.75
    fi
done

# Obfuscate mockups JS files
if [ -d "mockups" ]; then
    for jsfile in mockups/*.js; do
        if [ -f "$jsfile" ]; then
            filename=$(basename "$jsfile")
            echo "🔐 Obfuscating mockups/$filename..."
            javascript-obfuscator "$jsfile" \
              --output "dist/mockups/$filename" \
              --compact true \
              --control-flow-flattening true \
              --string-array true
        fi
    done
fi

# Minify HTML files
echo "📄 Minifying HTML files..."
for htmlfile in *.html; do
    if [ -f "$htmlfile" ]; then
        echo "📄 Minifying $htmlfile..."
        html-minifier \
          --collapse-whitespace \
          --remove-comments \
          --minify-css true \
          --minify-js true \
          "$htmlfile" -o "dist/$htmlfile"
    fi
done

# Copy other necessary files
echo "📋 Copying assets..."
cp -r css dist/ 2>/dev/null || echo "No css directory found"
cp -r images dist/ 2>/dev/null || echo "No images directory found"
cp -r assets dist/ 2>/dev/null || echo "No assets directory found"
cp -r fonts dist/ 2>/dev/null || echo "No fonts directory found"
cp -r data dist/ 2>/dev/null || echo "No data directory found"
cp -r mockup-images dist/ 2>/dev/null || echo "No mockup-images directory found"
cp -r videos dist/ 2>/dev/null || echo "No videos directory found"

# Copy mockups HTML if exists
if [ -f "mockups/index.html" ]; then
    mkdir -p dist/mockups
    html-minifier \
      --collapse-whitespace \
      --remove-comments \
      --minify-css true \
      --minify-js true \
      mockups/index.html -o dist/mockups/index.html
fi

echo ""
echo "✅ Secure build completed!"
echo "📁 Output directory: dist/"
echo ""
echo "🧪 To test locally (will show 'Access Denied' - expected):"
echo "   cd dist && python -m http.server 8000"
echo ""
echo "🚀 To deploy:"
echo "   ./push-prod.sh"
echo ""
echo "⚠️  Remember to run Supabase RLS setup before deploying:"
echo "   Copy SQL from supabase-rls-setup.sql to Supabase SQL Editor"