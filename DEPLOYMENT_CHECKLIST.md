# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## 📋 Pre-Deployment Checklist

### Backend Preparation

- [ ] **Environment Variables Ready**

  - [ ] PostgreSQL connection string from Neon
  - [ ] Strong JWT secret generated (`openssl rand -base64 32`)
  - [ ] Google OAuth Client ID
  - [ ] Google OAuth Client Secret
  - [ ] Google Cloud project ID noted

- [ ] **Google OAuth Configuration**

  - [ ] OAuth consent screen configured
  - [ ] Authorized redirect URIs added:
    - [ ] `http://localhost:8080/auth/google/callback` (dev)
    - [ ] `https://YOUR_PROJECT_ID.appspot.com/auth/google/callback` (prod)
  - [ ] Authorized JavaScript origins added:
    - [ ] `http://localhost:3000` (dev)
    - [ ] `https://YOUR_PROJECT_ID.appspot.com` (prod)
    - [ ] Your Vercel URL (prod)

- [ ] **Database Setup**

  - [ ] Neon database created and active
  - [ ] Migrations run: `npx prisma migrate deploy`
  - [ ] Prisma client generated: `npx prisma generate`
  - [ ] Database connection tested

- [ ] **Code Quality**

  - [ ] All tests passing: `npm test`
  - [ ] No console errors in development
  - [ ] All features tested manually
  - [ ] Security vulnerabilities checked: `npm audit`

- [ ] **Configuration Files**
  - [ ] `server/app.yaml` updated with production values
  - [ ] `server/.gcloudignore` configured
  - [ ] `.env` file NOT committed to git

### Frontend Preparation

- [ ] **Environment Variables Ready**

  - [ ] Backend API URL noted

- [ ] **Configuration Files**

  - [ ] `client/vercel.json` configured
  - [ ] `.env.local` file NOT committed to git

- [ ] **Build Test**
  - [ ] Production build successful: `npm run build`
  - [ ] No build errors or warnings
  - [ ] All pages render correctly

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

- [ ] **Install Google Cloud SDK**

  ```bash
  brew install google-cloud-sdk  # macOS
  ```

- [ ] **Login and Configure**

  ```bash
  gcloud init
  gcloud auth login
  gcloud config set project YOUR_PROJECT_ID
  ```

- [ ] **Update app.yaml**

  - [ ] Set `DATABASE_URL`
  - [ ] Set `JWT_SECRET`
  - [ ] Set `GOOGLE_CLIENT_ID`
  - [ ] Set `GOOGLE_CLIENT_SECRET`
  - [ ] Set `GOOGLE_CALLBACK_URL`
  - [ ] Set `CLIENT_URL` (temporary: use your expected Vercel URL)

- [ ] **Deploy Backend**

  ```bash
  cd server
  gcloud app deploy
  ```

- [ ] **Verify Backend**

  ```bash
  curl https://YOUR_PROJECT_ID.appspot.com/health
  ```

  Expected: `{"status":"healthy",...}`

- [ ] **Test Backend Endpoints**
  - [ ] `/health` returns 200
  - [ ] `/` returns API info
  - [ ] `/auth/google` redirects to Google

### Step 2: Deploy Frontend

- [ ] **Push to GitHub**

  ```bash
  git add .
  git commit -m "Ready for deployment"
  git push origin main
  ```

- [ ] **Connect to Vercel**

  - [ ] Login to Vercel
  - [ ] Click "Add New Project"
  - [ ] Import GitHub repository

- [ ] **Configure Vercel**

  - [ ] Framework: Next.js
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`

- [ ] **Set Environment Variables**

  - [ ] `NEXT_PUBLIC_API_URL` = `https://YOUR_PROJECT_ID.appspot.com`

- [ ] **Deploy**
  - [ ] Click "Deploy"
  - [ ] Wait for build to complete
  - [ ] Note your Vercel URL

### Step 3: Update Backend with Frontend URL

- [ ] **Update app.yaml**

  ```yaml
  CLIENT_URL: "https://your-actual-vercel-url.vercel.app"
  ```

- [ ] **Redeploy Backend**
  ```bash
  cd server
  gcloud app deploy
  ```

### Step 4: Update Google OAuth

- [ ] **Add Production URLs**
  - [ ] Authorized JavaScript origins:
    - [ ] `https://YOUR_PROJECT_ID.appspot.com`
    - [ ] `https://your-vercel-url.vercel.app`
  - [ ] Authorized redirect URIs:
    - [ ] `https://YOUR_PROJECT_ID.appspot.com/auth/google/callback`

---

## ✅ Post-Deployment Verification

### Backend Verification

- [ ] **Health Check**

  ```bash
  curl https://YOUR_PROJECT_ID.appspot.com/health
  ```

- [ ] **API Endpoints**

  - [ ] `/` returns API info
  - [ ] `/auth/google` redirects to Google
  - [ ] CORS headers present

- [ ] **Database Connection**
  - [ ] No connection errors in logs
  - [ ] `gcloud app logs tail -s default`

### Frontend Verification

- [ ] **Page Load**

  - [ ] Home page loads without errors
  - [ ] Login page loads without errors
  - [ ] Dashboard accessible (after login)

- [ ] **Console Check**
  - [ ] No JavaScript errors
  - [ ] API calls work (check Network tab)
  - [ ] No CORS errors

### End-to-End Testing

- [ ] **Google OAuth Flow**

  - [ ] Click "Sign in with Google"
  - [ ] Google authorization works
  - [ ] Redirects to dashboard
  - [ ] Tasks can be created

- [ ] **Email/Password Flow**

  - [ ] Signup with email/password works
  - [ ] Login with email/password works
  - [ ] Tasks can be created

- [ ] **Account Linking**

  - [ ] OAuth user can add password via signup
  - [ ] Email user can link Google account
  - [ ] Both auth methods work for same account

- [ ] **Task Operations**
  - [ ] Create task
  - [ ] Update task
  - [ ] Delete task
  - [ ] Filter by status
  - [ ] Filter by priority
  - [ ] Search tasks
  - [ ] Quick status update

---

## 🐛 Troubleshooting

### If Backend Deployment Fails

- [ ] Check `gcloud app logs tail -s default`
- [ ] Verify all environment variables in app.yaml
- [ ] Ensure DATABASE_URL is accessible
- [ ] Check Google Cloud project billing

### If Frontend Deployment Fails

- [ ] Check Vercel build logs
- [ ] Verify `NEXT_PUBLIC_API_URL` is set
- [ ] Ensure `npm run build` works locally
- [ ] Check for missing dependencies

### If OAuth Fails

- [ ] Verify redirect URIs in Google Console match exactly
- [ ] Check `GOOGLE_CALLBACK_URL` in app.yaml
- [ ] Ensure no trailing slashes in URLs
- [ ] Verify OAuth consent screen is configured

### If CORS Errors Occur

- [ ] Verify `CLIENT_URL` in backend matches Vercel URL exactly
- [ ] Check CORS configuration in `server/src/server.js`
- [ ] Ensure frontend URL includes protocol (https://)

---

## 📊 Monitoring

### Backend Logs

```bash
# Real-time logs
gcloud app logs tail -s default

# Recent logs
gcloud app logs read --limit=50
```

### Frontend Logs

- Vercel Dashboard → Your Project → Deployments → Latest → Function Logs

### Database Monitoring

- Neon Dashboard → Your Project → Monitoring

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Backend health endpoint returns 200
✅ Frontend loads without console errors
✅ Google OAuth login works
✅ Email/password login works
✅ Tasks can be created, updated, deleted
✅ Filters and search work
✅ Account linking works seamlessly
✅ No CORS errors
✅ All API calls return expected responses

---

## 📝 Environment Variables Summary

### Backend (Google App Engine)

```yaml
NODE_ENV: "production"
PORT: "8080"
DATABASE_URL: "postgresql://..."
JWT_SECRET: "strong-random-secret"
GOOGLE_CLIENT_ID: "your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET: "your-client-secret"
GOOGLE_CALLBACK_URL: "https://YOUR_PROJECT_ID.appspot.com/auth/google/callback"
CLIENT_URL: "https://your-vercel-url.vercel.app"
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://YOUR_PROJECT_ID.appspot.com
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] DATABASE_URL is not exposed publicly
- [ ] Google OAuth secrets are secure
- [ ] HTTPS enforced (automatic on both platforms)
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention measures in place

---

## 💾 Backup Checklist

- [ ] Database backup enabled in Neon
- [ ] Code pushed to GitHub
- [ ] Environment variables documented
- [ ] API documentation updated

---

## 🎉 You're Done!

Once all checkboxes are marked, your application is:

- ✅ Deployed and accessible
- ✅ Fully functional
- ✅ Secure
- ✅ Monitored
- ✅ Ready for users!

**Your URLs:**

- Backend: `https://YOUR_PROJECT_ID.appspot.com`
- Frontend: `https://your-app.vercel.app`

Share your deployed application with confidence! 🚀
