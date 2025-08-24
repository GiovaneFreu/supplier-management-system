# Vercel Deployment Setup

## Quick Start

1. **Execute the setup script:**
   ```bash
   chmod +x setup-vercel.sh
   ./setup-vercel.sh
   ```

## Manual Configuration

If you prefer to configure manually:

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Project
```bash
vercel link
```

### 4. Deploy
```bash
vercel --prod
```

## GitHub Secrets Required

Add these secrets to: https://github.com/GiovaneFreu/supplier-management-system/settings/secrets/actions

### VERCEL_TOKEN
1. Go to: https://vercel.com/account/tokens
2. Create new token named "GitHub Actions"
3. Copy the token value

### VERCEL_ORG_ID and VERCEL_PROJECT_ID
After running `vercel link`, these values will be in `.vercel/project.json`

## Deployment Pipeline

- **Push to main** → Automatic production deployment
- **Pull Request** → Automatic preview deployment with comment

## Files Updated

- ✅ `vercel.json` - Simplified configuration
- ✅ `.github/workflows/deploy.yml` - Streamlined CI/CD pipeline
- ✅ `setup-vercel.sh` - Automated setup script