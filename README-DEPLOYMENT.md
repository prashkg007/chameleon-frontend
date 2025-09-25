# Chameleon Frontend - S3 Deployment Setup

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- AWS CLI configured
- S3 bucket created
- Linux/Amazon Linux environment

### Deploy to S3
```bash
# Build and deploy to S3
npm run deploy:s3

# Deploy to staging environment
npm run deploy:s3:staging

# Manual deployment (Amazon Linux compatible)
bash scripts/deploy-to-s3.sh your-bucket-name latest
```

## 📋 GitHub Actions Setup

### Required Secrets
Add these secrets to your GitHub repository:

```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
```

### Workflow Features
- ✅ Node.js 20.x with proper caching
- ✅ Automated testing before build
- ✅ SPA routing configuration
- ✅ Versioned deployments
- ✅ S3 website hosting setup
- ✅ Cache optimization

## 🏗️ Build Configuration

### Vite Configuration
- **Base Path**: `./` (relative paths for S3)
- **Code Splitting**: Vendor and router chunks
- **Minification**: Terser for production
- **Source Maps**: Disabled for production

### SPA Routing
- All routes fallback to `index.html`
- 404 errors redirect to main app
- Client-side routing with React Router

## 📁 Project Structure

```
Chameleon-Frontend/
├── .github/workflows/
│   └── ci-cd.yml              # GitHub Actions workflow
├── scripts/
│   └── deploy-to-s3.sh       # Bash deployment script (Linux/Amazon Linux)
├── src/
│   ├── pages/                 # Route components
│   ├── components/            # Shared components
│   └── services/             # API services
├── dist/                      # Build output
├── vite.config.ts            # Vite configuration
├── s3-deployment-config.json # Deployment configuration
└── DEPLOYMENT.md             # Detailed deployment guide
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run test:build            # Build and preview locally

# Production
npm run build:spa             # Build for production
npm run deploy:s3            # Deploy to S3
npm run deploy:s3:staging    # Deploy to staging

# Analysis
npm run analyze               # Bundle analysis
```

## 🌐 S3 Configuration

### Bucket Setup
1. Create S3 bucket
2. Enable static website hosting
3. Set bucket policy for public read
4. Configure error document as `404.html`

### Website Configuration
```json
{
  "IndexDocument": {"Suffix": "index.html"},
  "ErrorDocument": {"Suffix": "404.html"}
}
```

## 🛣️ Routing Configuration

### Client-Side Routes
- `/` - Home page
- `/pricing` - Pricing page  
- `/login` - Login page
- `/signup` - Signup page
- `/auth/callback` - OAuth callback
- `/subscribe` - Subscription page
- `/success` - Success page
- `/cancel` - Cancel page

### S3 Fallback
- All routes → `index.html`
- 404 errors → `index.html` (for SPA routing)
- Static assets served directly

## 📊 Performance Optimization

### Bundle Splitting
- **Vendor Chunk**: React, React DOM
- **Router Chunk**: React Router DOM
- **App Chunk**: Application code

### Caching Strategy
- **Static Assets**: 1 year cache
- **HTML Files**: 5 minutes cache
- **API Responses**: No cache

## 🔒 Security Headers

### Content Security Policy
```
default-src 'self'; 
script-src 'self' 'unsafe-inline'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: https:;
```

### Additional Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`

## 🚨 Troubleshooting

### Common Issues

1. **Routing not working**
   - Check S3 website hosting is enabled
   - Verify 404.html is configured as error document

2. **Assets not loading**
   - Check base path in vite.config.ts
   - Verify S3 bucket permissions

3. **Build failures**
   - Ensure Node.js 20.x is installed
   - Check all dependencies are installed

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

## 📈 Monitoring

### Deployment Tracking
- Each deployment creates a versioned release
- Latest deployment available at `/latest/`
- Version format: `YYYYMMDD-HHMMSS-commitHash`

### Health Checks
```bash
# Check website availability
curl -I http://your-bucket-name.s3-website-region.amazonaws.com

# Test SPA routing
curl -I http://your-bucket-name.s3-website-region.amazonaws.com/pricing
```

## 🔄 CI/CD Pipeline

### Automatic Deployment
1. Push to `main` branch
2. GitHub Actions runs:
   - Tests
   - Build
   - Deploy to S3
   - Configure SPA routing

### Manual Deployment
```bash
# Local deployment
npm run deploy:s3

# Staging deployment  
npm run deploy:s3:staging
```

## 📚 Additional Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
