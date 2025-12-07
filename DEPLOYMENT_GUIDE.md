# Deployment Guide - Task Management Application

## Overview

This guide provides step-by-step instructions for deploying the Task Management application:

- **Backend**: Google App Engine (Node.js + Express)
- **Frontend**: Vercel (Next.js)
- **Database**: Neon PostgreSQL (already provisioned)

---

## 📋 Prerequisites

Before deployment, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **Vercel Account** (free tier works)
3. **Neon Database** (already created)
4. **Google OAuth Credentials** (already configured)
5. **Git Repository** (pushed to GitHub)

---

## 🚀 Backend Deployment - Google App Engine

### Step 1: Install Google Cloud SDK

```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Step 2: Initialize and Login

```bash
gcloud init
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 3: Create app.yaml Configuration

The `app.yaml` file is already created in the `server/` directory with all necessary configurations.

### Step 4: Set Environment Variables

**IMPORTANT**: Update these values in `server/app.yaml` before deployment:

```yaml
env_variables:
  NODE_ENV: "production"
  DATABASE_URL: "your-neon-database-url-here"
  JWT_SECRET: "your-strong-random-secret-here"
  GOOGLE_CLIENT_ID: "your-google-client-id.apps.googleusercontent.com"
  GOOGLE_CLIENT_SECRET: "your-google-client-secret"
  GOOGLE_CALLBACK_URL: "https://YOUR_PROJECT_ID.appspot.com/auth/google/callback"
  CLIENT_URL: "https://your-vercel-app.vercel.app"
```

**How to get these values:**

1. **DATABASE_URL**: Copy from Neon dashboard (Connection String)
2. **JWT_SECRET**: Generate with: `openssl rand -base64 32`
3. **GOOGLE_CLIENT_ID**: From Google Cloud Console → APIs & Services → Credentials
4. **GOOGLE_CLIENT_SECRET**: Same location as Client ID
5. **GOOGLE_CALLBACK_URL**: Replace `YOUR_PROJECT_ID` with your GCP project ID
6. **CLIENT_URL**: Your Vercel deployment URL (update after frontend deployment)

### Step 5: Update Google OAuth Authorized Redirect URIs

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Navigate to: APIs & Services → Credentials
2. Click on your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://YOUR_PROJECT_ID.appspot.com/auth/google/callback
   ```
4. Add to "Authorized JavaScript origins":
   ```
   https://YOUR_PROJECT_ID.appspot.com
   https://your-vercel-app.vercel.app
   ```
5. Save changes

### Step 6: Deploy Backend

```bash
cd server
gcloud app deploy
```

Follow prompts to confirm deployment.

### Step 7: Verify Backend Deployment

```bash
# Get backend URL
gcloud app browse

# Test health endpoint
curl https://YOUR_PROJECT_ID.appspot.com/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2025-12-07T...",
  "environment": "production"
}
```

---

## 🌐 Frontend Deployment - Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `Task-Management`

### Step 4: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### Step 5: Set Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable Name         | Value                                 | Notes                      |
| --------------------- | ------------------------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://YOUR_PROJECT_ID.appspot.com` | Your Google App Engine URL |

**Important**:

- Replace `YOUR_PROJECT_ID` with your actual GCP project ID
- This variable must start with `NEXT_PUBLIC_` to be accessible in the browser

### Step 6: Deploy Frontend

Click "Deploy" button in Vercel dashboard.

Vercel will:

1. Install dependencies
2. Build the Next.js application
3. Deploy to global CDN
4. Provide a production URL

### Step 7: Update Backend CLIENT_URL

After Vercel deployment completes:

1. Copy your Vercel production URL (e.g., `https://task-management-xyz.vercel.app`)
2. Update `server/app.yaml`:
   ```yaml
   CLIENT_URL: "https://task-management-xyz.vercel.app"
   ```
3. Redeploy backend:
   ```bash
   cd server
   gcloud app deploy
   ```

### Step 8: Update Google OAuth Origins

Add your Vercel URL to Google OAuth:

1. Go to Google Cloud Console → Credentials
2. Add to "Authorized JavaScript origins":
   ```
   https://task-management-xyz.vercel.app
   ```
3. Save changes

---

## 🔐 Environment Variables Reference

### Backend (Google App Engine) - app.yaml

```yaml
env_variables:
  # Server Configuration
  NODE_ENV: "production"
  PORT: "8080" # App Engine uses 8080 by default

  # Database
  DATABASE_URL: "postgresql://user:pass@host/db?sslmode=require"

  # JWT Authentication
  JWT_SECRET: "your-super-secret-jwt-key-min-32-chars"

  # Google OAuth
  GOOGLE_CLIENT_ID: "your-app.apps.googleusercontent.com"
  GOOGLE_CLIENT_SECRET: "GOCSPX-your-secret"
  GOOGLE_CALLBACK_URL: "https://your-project.appspot.com/auth/google/callback"

  # CORS - Frontend URL
  CLIENT_URL: "https://your-app.vercel.app"
```

### Frontend (Vercel) - Environment Variables

```env
# API Backend URL (Must start with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://your-project.appspot.com
```

---

## 🧪 Post-Deployment Testing

### Test Backend

```bash
# Health check
curl https://YOUR_PROJECT_ID.appspot.com/health

# API info
curl https://YOUR_PROJECT_ID.appspot.com/

# Google OAuth (in browser)
https://YOUR_PROJECT_ID.appspot.com/auth/google
```

### Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Sign in with Google"
3. Authorize with Google account
4. Should redirect to dashboard
5. Create a test task
6. Verify task appears in dashboard

### Test Account Linking

1. Logout from dashboard
2. Click "Sign Up" tab
3. Use same email as Google account
4. Set username and password
5. Should show: "Password added to your account successfully"
6. Logout and login with username/password
7. Should work seamlessly

---

## 🔧 Troubleshooting

### Issue: CORS Errors

**Symptom**: Frontend can't connect to backend

**Solution**:

1. Verify `CLIENT_URL` in backend matches exact Vercel URL
2. Check browser console for actual error
3. Ensure Google OAuth origins include Vercel URL

### Issue: Google OAuth Fails

**Symptom**: Redirect fails or "redirect_uri_mismatch" error

**Solution**:

1. Check `GOOGLE_CALLBACK_URL` matches exactly in app.yaml
2. Verify authorized redirect URIs in Google Console
3. Ensure no trailing slashes in URLs

### Issue: Database Connection Fails

**Symptom**: 500 errors on API calls

**Solution**:

1. Verify `DATABASE_URL` in app.yaml is correct
2. Check Neon database is active (not paused)
3. Test connection: `npx prisma studio` (locally with production DATABASE_URL)

### Issue: Environment Variables Not Working

**Symptom**: App behaves like variables are undefined

**Solution**:

1. **Backend**: Redeploy after changing app.yaml
2. **Frontend**: Ensure variables start with `NEXT_PUBLIC_`
3. **Frontend**: Redeploy after adding environment variables

---

## 📊 Monitoring and Logs

### Backend Logs (Google App Engine)

```bash
# Stream logs in real-time
gcloud app logs tail -s default

# View recent logs
gcloud app logs read
```

### Frontend Logs (Vercel)

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment
5. View "Build Logs" and "Function Logs"

---

## 🔄 Continuous Deployment

### Backend (Google App Engine)

Set up automatic deployment:

1. Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy to App Engine

on:
  push:
    branches: [main]
    paths:
      - "server/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      - name: Deploy
        run: |
          cd server
          gcloud app deploy --quiet
```

2. Add secrets to GitHub repository:
   - `GCP_SA_KEY`: Service account JSON key
   - `GCP_PROJECT_ID`: Your GCP project ID

### Frontend (Vercel)

Vercel automatically deploys on git push:

- Push to `main` → Production deployment
- Push to other branches → Preview deployment

---

## 💰 Cost Estimates

### Google App Engine

- **Free Tier**: 28 instance hours/day
- **Estimated**: $0-10/month for small apps
- **Scaling**: Automatic based on traffic

### Vercel

- **Free Tier**: 100 GB bandwidth/month
- **Estimated**: $0/month for hobby projects
- **Pro Plan**: $20/month if needed

### Neon PostgreSQL

- **Free Tier**: 0.5 GB storage, 3 GB data transfer
- **Estimated**: $0/month for small apps

**Total Estimated Cost**: $0-15/month

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use production `DATABASE_URL` (not shared)
- [ ] Enable HTTPS only (both platforms do this by default)
- [ ] Review Google OAuth scopes (currently: profile, email)
- [ ] Set up database backups in Neon dashboard
- [ ] Enable Google Cloud Logging
- [ ] Add rate limiting (optional, see Express rate-limit)
- [ ] Review CORS settings in backend
- [ ] Test authentication flows end-to-end
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

---

## 📚 Additional Resources

- [Google App Engine Node.js Docs](https://cloud.google.com/appengine/docs/standard/nodejs)
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Neon Database Docs](https://neon.tech/docs/introduction)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs (backend and frontend)
3. Verify all environment variables are set correctly
4. Test locally first with production DATABASE_URL
5. Check Google OAuth configuration in Cloud Console

---

## 🎉 Deployment Complete!

Once both deployments are successful:

✅ Backend API running on Google App Engine
✅ Frontend app running on Vercel
✅ Database connected via Neon PostgreSQL
✅ Google OAuth working
✅ Account linking functional
✅ All features operational

**Your application is now live!** 🚀
