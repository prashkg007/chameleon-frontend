# Chameleon Frontend S3 Deployment Guide

## Overview
This guide covers deploying the Chameleon Frontend as a Single Page Application (SPA) to AWS S3 with proper routing support.

## Architecture
- **Frontend**: React SPA with React Router
- **Hosting**: AWS S3 Static Website Hosting
- **Routing**: Client-side routing with S3 fallback configuration
- **CI/CD**: GitHub Actions with automated deployment

## Prerequisites

### AWS Setup
1. Create an S3 bucket for hosting
2. Configure bucket for static website hosting
3. Set up IAM user with S3 permissions
4. Configure GitHub Secrets

### Required GitHub Secrets
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
```

## S3 Bucket Configuration

### 1. Enable Static Website Hosting
```bash
aws s3api put-bucket-website \
  --bucket your-bucket-name \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Suffix": "404.html"}
  }'
```

### 2. Set Bucket Policy for Public Read
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Deployment Process

### Automatic Deployment (GitHub Actions)
1. Push to `main` branch
2. GitHub Actions automatically:
   - Runs tests
   - Builds the application
   - Deploys to S3 with versioning
   - Configures SPA routing

### Manual Deployment (Amazon Linux Compatible)
```bash
# Build the application
npm run build:spa

# Deploy to S3 using the script
bash scripts/deploy-to-s3.sh your-bucket-name latest

# Or deploy directly with AWS CLI
aws s3 sync dist/ s3://your-bucket-name/latest/ --delete
```

## SPA Routing Configuration

### Client-Side Routes
- `/` - Home page
- `/pricing` - Pricing page
- `/login` - Login page
- `/signup` - Signup page
- `/auth/callback` - OAuth callback
- `/subscribe` - Subscription page
- `/success` - Success page
- `/cancel` - Cancel page

### S3 Fallback Configuration
- All routes fallback to `index.html`
- 404 errors redirect to `index.html` for SPA routing
- Static assets cached with appropriate headers

## Build Optimization

### Vite Configuration
- Code splitting for vendor libraries
- Terser minification
- Asset optimization
- Source map generation (disabled for production)

### Bundle Analysis
```bash
npm run analyze
```

## Monitoring and Maintenance

### Version Management
- Each deployment creates a versioned release
- Latest deployment available at `/latest/`
- Version format: `YYYYMMDD-HHMMSS-commitHash`

### Cache Strategy
- Static assets: 1 year cache
- HTML files: 5 minutes cache
- API responses: No cache

## Troubleshooting

### Common Issues

1. **Routing not working**
   - Ensure 404.html is configured as error document
   - Check S3 website hosting is enabled

2. **Assets not loading**
   - Verify base path in vite.config.ts
   - Check S3 bucket permissions

3. **Build failures**
   - Check Node.js version (20.x)
   - Verify all dependencies are installed

### Debug Commands
```bash
# Test build locally
npm run build:spa
npm run preview

# Check S3 configuration
aws s3api get-bucket-website --bucket your-bucket-name

# Verify deployment
curl -I http://your-bucket-name.s3-website-region.amazonaws.com
```

## Security Considerations

### Content Security Policy
- Configured in deployment headers
- Prevents XSS attacks
- Restricts resource loading

### HTTPS (Recommended)
- Use CloudFront for HTTPS
- Configure SSL certificate
- Redirect HTTP to HTTPS

## Performance Optimization

### Bundle Splitting
- Vendor libraries in separate chunks
- Router code in separate chunk
- Lazy loading for route components

### Caching Strategy
- Aggressive caching for static assets
- Short cache for HTML files
- No cache for API responses

## Future Enhancements

### Planned Features
- CloudFront CDN integration
- Custom domain configuration
- Environment-specific deployments
- Automated testing in CI/CD
- Performance monitoring
