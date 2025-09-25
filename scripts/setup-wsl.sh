#!/bin/bash

# WSL Ubuntu Setup Script for Chameleon Frontend
# Run this script to set up the development environment

set -e

echo "🐧 Setting up WSL Ubuntu environment for Chameleon Frontend..."

# Check if running in WSL
if ! grep -q Microsoft /proc/version; then
    echo "⚠️  Warning: This script is designed for WSL Ubuntu"
fi

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install Node.js 20.x
echo "🟢 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install AWS CLI v2
echo "☁️  Installing AWS CLI v2..."
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
else
    echo "✅ AWS CLI already installed"
fi

# Install additional dependencies
echo "🔧 Installing additional dependencies..."
sudo apt-get install -y unzip curl

# Verify installations
echo "✅ Verifying installations..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "AWS CLI version: $(aws --version)"

# Set up project
echo "📁 Setting up project..."
npm install

# Make scripts executable
chmod +x scripts/deploy-to-s3.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure AWS credentials:"
echo "   aws configure"
echo ""
echo "2. Set environment variables:"
echo "   export S3_BUCKET_NAME='your-bucket-name'"
echo "   export AWS_REGION='us-east-1'"
echo ""
echo "3. Test the build:"
echo "   npm run build:spa"
echo ""
echo "4. Test deployment:"
echo "   ./scripts/deploy-to-s3.sh"
echo ""
echo "5. Or use npm scripts:"
echo "   npm run deploy:s3"
