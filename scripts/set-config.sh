#!/bin/bash

# Configuration Management Script for Chameleon Frontend
# Usage: ./scripts/set-config.sh [environment] [api-url]

set -e

ENVIRONMENT=${1:-"development"}
API_URL=${2:-"http://localhost:3001/api"}

echo "🔧 Setting configuration for $ENVIRONMENT environment..."
echo "API URL: $API_URL"

# Create environment file
cat > .env << EOF
# Auto-generated environment file
VITE_API_BASE_URL=$API_URL
VITE_APP_ENV=$ENVIRONMENT
EOF

echo "✅ Configuration updated!"
echo "📁 Environment file created: .env"
echo ""
echo "🔍 Current configuration:"
echo "Environment: $ENVIRONMENT"
echo "API Base URL: $API_URL"
echo ""
echo "📋 Next steps:"
echo "1. Run: npm run build:spa"
echo "2. Run: ./scripts/deploy-to-s3.sh chameleon-frontend-website latest"
