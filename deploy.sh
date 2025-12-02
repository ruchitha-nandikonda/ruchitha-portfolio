#!/bin/bash

# Vercel Deployment Script
echo "🚀 Deploying to Vercel..."

# Build the project first
echo "📦 Building project..."
npm run build

# Deploy using npx (no global install needed)
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"

