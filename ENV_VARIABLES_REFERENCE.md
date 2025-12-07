# Environment Variables Quick Reference

## 🔧 Backend Environment Variables (Google App Engine)

### Location: `server/app.yaml`

```yaml
env_variables:
  # Server Configuration
  NODE_ENV: "production"
  PORT: "8080"

  # Database (Neon PostgreSQL)
  DATABASE_URL: "postgresql://neondb_owner:PASSWORD@HOST.neon.tech/neondb?sslmode=require"

  # JWT Authentication
  JWT_SECRET: "GENERATE_WITH: openssl rand -base64 32"

  # Google OAuth
  GOOGLE_CLIENT_ID: "YOUR_ID.apps.googleusercontent.com"
  GOOGLE_CLIENT_SECRET: "GOCSPX-YOUR_SECRET"
  GOOGLE_CALLBACK_URL: "https://YOUR_PROJECT_ID.appspot.com/auth/google/callback"

  # CORS
  CLIENT_URL: "https://your-app.vercel.app"
```

### How to Get Each Value:

| Variable               | Where to Get It                                           |
| ---------------------- | --------------------------------------------------------- |
| `DATABASE_URL`         | Neon Dashboard → Connection Details → Connection String   |
| `JWT_SECRET`           | Generate: `openssl rand -base64 32`                       |
| `GOOGLE_CLIENT_ID`     | Google Cloud Console → Credentials → OAuth 2.0 Client     |
| `GOOGLE_CLIENT_SECRET` | Same location as Client ID                                |
| `GOOGLE_CALLBACK_URL`  | Replace `YOUR_PROJECT_ID` with your GCP project ID        |
| `CLIENT_URL`           | Your Vercel deployment URL (get after deploying frontend) |

---

## 🌐 Frontend Environment Variables (Vercel)

### Location: Vercel Dashboard → Settings → Environment Variables

```
NEXT_PUBLIC_API_URL=https://YOUR_PROJECT_ID.appspot.com
```

### How to Get:

| Variable              | Value                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Your Google App Engine URL (format: `https://PROJECT_ID.appspot.com`) |

**Important:** Must start with `NEXT_PUBLIC_` to be accessible in the browser.

---

## 🔍 Local Development Variables

### Backend (`server/.env`)

```env
PORT=8080
NODE_ENV=development
DATABASE_URL="postgresql://..."  # From Neon
JWT_SECRET="dev-secret-key"      # Different from production
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:8080/auth/google/callback"
CLIENT_URL="http://localhost:3000"
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## ⚙️ Google OAuth Setup

### Required Configurations in Google Cloud Console

**Location:** APIs & Services → Credentials → OAuth 2.0 Client

#### Authorized JavaScript Origins

```
Development:
http://localhost:3000
http://localhost:8080

Production:
https://YOUR_PROJECT_ID.appspot.com
https://your-app.vercel.app
```

#### Authorized Redirect URIs

```
Development:
http://localhost:8080/auth/google/callback

Production:
https://YOUR_PROJECT_ID.appspot.com/auth/google/callback
```

---

## 📝 Copy-Paste Templates

### Generate JWT Secret

```bash
openssl rand -base64 32
```

### Test Backend Health

```bash
# Local
curl http://localhost:8080/health

# Production
curl https://YOUR_PROJECT_ID.appspot.com/health
```

### View Backend Logs

```bash
gcloud app logs tail -s default
```

---

## ⚠️ Common Mistakes to Avoid

1. **Don't commit `.env` files** - Use `.env.example` instead
2. **Include protocol** - Use `https://` not just `domain.com`
3. **No trailing slashes** - Use `/auth/callback` not `/auth/callback/`
4. **Match URLs exactly** - `http://localhost:3000` ≠ `http://localhost:3000/`
5. **Update after deployment** - Remember to update `CLIENT_URL` after Vercel deployment

---

## 🔐 Security Best Practices

- ✅ Use strong random strings for `JWT_SECRET` (min 32 characters)
- ✅ Different secrets for development and production
- ✅ Never share or commit secrets to version control
- ✅ Rotate secrets periodically
- ✅ Use environment-specific OAuth credentials
- ✅ Enable 2FA on cloud accounts

---

## 🆘 Quick Troubleshooting

### "Invalid redirect URI"

- Check `GOOGLE_CALLBACK_URL` matches exactly in Google Console
- Ensure no typos or extra slashes
- Verify protocol (http vs https)

### "CORS Error"

- Verify `CLIENT_URL` in backend matches frontend URL exactly
- Check Google OAuth origins include frontend URL
- Ensure protocol and port match

### "Database Connection Error"

- Verify `DATABASE_URL` is correct
- Check Neon database is active (not paused)
- Test connection with: `npx prisma studio`

### "Environment variable undefined"

- Backend: Redeploy after changing `app.yaml`
- Frontend: Ensure variable starts with `NEXT_PUBLIC_`
- Frontend: Redeploy after adding variables in Vercel

---

## 📋 Deployment Order

1. **Setup Database** (Neon)

   - Create database
   - Note connection string

2. **Setup Google OAuth**

   - Create credentials
   - Note Client ID and Secret
   - Add redirect URIs

3. **Deploy Backend** (Google App Engine)

   - Update `app.yaml` with all variables
   - Deploy: `gcloud app deploy`
   - Note backend URL

4. **Deploy Frontend** (Vercel)

   - Set `NEXT_PUBLIC_API_URL` to backend URL
   - Deploy from GitHub
   - Note frontend URL

5. **Update Backend**

   - Set `CLIENT_URL` to frontend URL
   - Redeploy: `gcloud app deploy`

6. **Update Google OAuth**
   - Add production URLs to origins and redirect URIs

---

## ✅ Verification Commands

```bash
# Check backend is running
curl https://YOUR_PROJECT_ID.appspot.com/health

# Check frontend environment variable (in browser console)
console.log(process.env.NEXT_PUBLIC_API_URL)

# Check backend logs
gcloud app logs tail -s default

# Test database connection
cd server && npx prisma studio
```

---

## 📞 Need Help?

Refer to:

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [README.md](./README.md) - Project overview and local setup
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
