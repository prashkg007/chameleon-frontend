# 🔧 Chameleon Frontend Configuration Guide

## Overview
This guide explains how to manage environment-specific configurations for the Chameleon Frontend application.

## 📁 Configuration Files

### Environment Files
- `env.development` - Development environment variables
- `env.production` - Production environment variables
- `.env` - Auto-generated environment file (created by scripts)

### Configuration Files
- `src/config.ts` - Main configuration file
- `vite.config.ts` - Vite build configuration
- `scripts/set-config.sh` - Configuration management script

## 🚀 Quick Configuration

### Development (Local Backend)
```bash
# Set development configuration
npm run config:dev

# Build and test locally
npm run build:dev
npm run preview
```

### Production (Deployed Backend)
```bash
# Set production configuration (update URL first)
npm run config:prod

# Build and deploy
npm run build:spa
npm run deploy:s3
```

## 🔧 Manual Configuration

### Using the Configuration Script
```bash
# Set custom configuration
./scripts/set-config.sh production https://your-backend-api.com/api

# Set development configuration
./scripts/set-config.sh development http://localhost:3000/api
```

### Manual Environment File
Create a `.env` file:
```bash
# .env
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_APP_ENV=production
```

## 📋 Configuration Variables

### Required Variables
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_ENV` - Application environment (development/production)

### Example Configurations

#### Development
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

#### Production
```bash
VITE_API_BASE_URL=https://api.chameleon.com/api
VITE_APP_ENV=production
```

#### Staging
```bash
VITE_API_BASE_URL=https://staging-api.chameleon.com/api
VITE_APP_ENV=staging
```

## 🔄 Workflow

### 1. Development Setup
```bash
# Start with development configuration
npm run config:dev

# Start development server
npm run dev
```

### 2. Production Deployment
```bash
# Update production configuration
npm run config:prod

# Build for production
npm run build:spa

# Deploy to S3
npm run deploy:s3
```

### 3. Custom Backend URL
```bash
# Set custom backend URL
./scripts/set-config.sh production https://your-custom-backend.com/api

# Build and deploy
npm run build:spa
npm run deploy:s3
```

## 🐛 Troubleshooting

### Common Issues

1. **API calls failing**
   - Check if backend is running
   - Verify API URL in configuration
   - Check CORS settings on backend

2. **Environment variables not loading**
   - Ensure `.env` file exists
   - Check variable names (must start with `VITE_`)
   - Restart development server

3. **Build issues**
   - Clear node_modules and reinstall
   - Check for syntax errors in config files
   - Verify environment file format

### Debug Commands
```bash
# Check current configuration
cat .env

# Verify build configuration
npm run build:spa

# Test local preview
npm run preview
```

## 📚 Best Practices

### 1. Environment Management
- Use different configurations for different environments
- Never commit sensitive data to version control
- Use environment variables for all external URLs

### 2. Configuration Updates
- Always update configuration before deployment
- Test configuration changes locally first
- Document any configuration changes

### 3. Backend Integration
- Ensure backend is deployed before updating frontend
- Test API connectivity before deployment
- Use HTTPS URLs for production

## 🔗 Related Files

- `src/config.ts` - Main configuration logic
- `src/pages/Login.tsx` - Uses API configuration
- `scripts/deploy-to-s3.sh` - Deployment script
- `vite.config.ts` - Build configuration
