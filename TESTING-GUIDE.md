# 🧪 Chameleon Frontend Testing Guide (WSL Ubuntu)

## Quick Setup

### 1. Run the setup script
```bash
chmod +x scripts/setup-wsl.sh
./scripts/setup-wsl.sh
```

### 2. Configure AWS credentials
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key  
# Enter your default region (e.g., us-east-1)
# Enter your default output format (e.g., json)
```

### 3. Set environment variables
```bash
export S3_BUCKET_NAME="chameleon-frontend-spa"
export AWS_REGION="us-east-1"
export AWS_PROFILE="default"
```

## Testing Steps

### Step 1: Test Build Process
```bash
# Clean any previous builds
rm -rf dist/

# Test production build
npm run build:spa

# Verify build output
ls -la dist/
```

**Expected output:**
- `dist/index.html`
- `dist/assets/` directory with JS/CSS files
- Proper chunk splitting (vendor, router, app)

### Step 2: Test Local Preview
```bash
# Start local preview server
npm run preview

# Open browser to http://localhost:5174
# Test all routes:
# - http://localhost:5174/
# - http://localhost:5174/pricing
# - http://localhost:5174/login
# - http://localhost:5174/signup
```

### Step 3: Test S3 Deployment Script
```bash
# Test deployment script (dry run)
./scripts/deploy-to-s3.sh --help

# Test with your bucket
./scripts/deploy-to-s3.sh your-bucket-name latest
```

### Step 4: Test SPA Routing
After deployment, test these URLs:
- `http://your-bucket-name.s3-website-region.amazonaws.com/`
- `http://your-bucket-name.s3-website-region.amazonaws.com/pricing`
- `http://your-bucket-name.s3-website-region.amazonaws.com/login`
- `http://your-bucket-name.s3-website-region.amazonaws.com/signup`

## Environment Variables Reference

### Required Variables
```bash
# AWS Credentials
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_REGION="us-east-1"

# S3 Configuration
export S3_BUCKET_NAME="chameleon-frontend-spa"
```

### Optional Variables
```bash
# AWS Profile
export AWS_PROFILE="default"

# Staging environment
export S3_BUCKET_STAGING="chameleon-frontend-staging"
```

## Troubleshooting

### Common Issues

1. **Node.js not found**
   ```bash
   # Reinstall Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **AWS CLI not found**
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

3. **Permission denied on scripts**
   ```bash
   chmod +x scripts/*.sh
   ```

4. **Build fails with terser error**
   ```bash
   npm install --save-dev terser
   ```

5. **S3 access denied**
   ```bash
   # Check AWS credentials
   aws sts get-caller-identity
   
   # Check S3 bucket permissions
   aws s3 ls s3://your-bucket-name
   ```

### Debug Commands

```bash
# Check environment
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "AWS: $(aws --version)"
echo "AWS Profile: $AWS_PROFILE"
echo "S3 Bucket: $S3_BUCKET_NAME"

# Test AWS connectivity
aws sts get-caller-identity

# Test S3 access
aws s3 ls s3://$S3_BUCKET_NAME

# Test build
npm run build:spa && echo "Build successful"

# Test deployment script
./scripts/deploy-to-s3.sh --help
```

## Expected Results

### Build Output
```
dist/
├── index.html
├── 404.html
├── _redirects
└── assets/
    ├── index-[hash].css
    ├── index-[hash].js
    ├── router-[hash].js
    └── vendor-[hash].js
```

### S3 Structure
```
s3://your-bucket-name/
├── latest/
│   ├── index.html
│   ├── 404.html
│   ├── _redirects
│   └── assets/
└── releases/
    └── YYYYMMDD-HHMMSS-commitHash/
```

### Website URLs
- **Main site**: `http://your-bucket-name.s3-website-region.amazonaws.com`
- **All routes work**: Pricing, Login, Signup, etc.
- **SPA routing**: Direct URL access works
- **404 handling**: Unknown routes redirect to main app
