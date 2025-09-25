#!/bin/bash

# Chameleon Frontend S3 Deployment Script
# Usage: ./scripts/deploy-to-s3.sh [bucket-name] [environment]
# Compatible with Amazon Linux AMI and GitHub Actions

set -e

BUCKET_NAME=${1:-"chameleon-frontend-website"}
ENVIRONMENT=${2:-"latest"}
AWS_REGION="ap-south-1"

# Build S3 path
if [ "$ENVIRONMENT" = "latest" ]; then
    S3_PATH="s3://$BUCKET_NAME/latest/"
else
    S3_PATH="s3://$BUCKET_NAME/$ENVIRONMENT/"
fi

echo "🚀 Deploying Chameleon Frontend to S3..."
echo "Bucket: $BUCKET_NAME"
echo "Environment: $ENVIRONMENT"
echo "S3 Path: $S3_PATH"
echo "Region: $AWS_REGION"
echo "Platform: $(uname -s)"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if bucket exists
if ! aws s3 ls "s3://$BUCKET_NAME" 2>/dev/null; then
    echo "❌ Bucket $BUCKET_NAME does not exist or is not accessible."
    echo "Please create the bucket first or check your AWS credentials."
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build:spa

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. dist directory not found."
    exit 1
fi

# Create SPA fallback files
echo "🔧 Configuring SPA routing..."
cp dist/index.html dist/404.html
echo "/*    /index.html   200" > dist/_redirects

# Deploy to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ "$S3_PATH" \
    --delete \
    --cache-control "max-age=31536000" \
    --metadata-directive REPLACE

# Configure S3 website hosting
echo "🌐 Configuring S3 website hosting..."
aws s3api put-bucket-website \
    --bucket "$BUCKET_NAME" \
    --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Suffix": "404.html"}
    }' 2>/dev/null || echo "Website configuration may already exist"

# Get website URL
if [ "$ENVIRONMENT" = "latest" ]; then
    WEBSITE_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com/"
else
    WEBSITE_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com/$ENVIRONMENT"
fi

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Website URL: $WEBSITE_URL"
echo "📁 S3 Location: $S3_PATH"
echo ""
echo "🔍 To test the deployment:"
echo "curl -I $WEBSITE_URL"
echo ""
echo "📋 SPA Routes to test:"
echo "- $WEBSITE_URL/"
echo "- $WEBSITE_URL/pricing"
echo "- $WEBSITE_URL/login"
echo "- $WEBSITE_URL/signup"