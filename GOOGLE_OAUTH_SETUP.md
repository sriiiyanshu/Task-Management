# Google OAuth Configuration Fix

## Error Explanation

**Error:** `400: redirect_uri_mismatch`

This happens when the redirect URI in your app doesn't match what's configured in Google Cloud Console.

---

## Current Configuration

**Your App's Callback URL:**
```
http://localhost:8080/auth/google/callback
```

**Issue:** Google Cloud Console has a different redirect URI configured.

---

## How to Fix in Google Cloud Console

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project (or create one if you haven't)

### Step 2: Navigate to OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Make sure you've configured:
   - App name: "Task Tracker"
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: `userinfo.email`, `userinfo.profile`

### Step 3: Configure Authorized Redirect URIs
1. Go to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID (the one starting with `311510222867-...`)
3. Click on it to edit
4. Under **Authorized redirect URIs**, add:

```
http://localhost:8080/auth/google/callback
```

5. If you already have a different redirect URI, **replace it** with the one above
6. Click **Save**

### Step 4: Restart Your Server
After updating Google Cloud Console:

```bash
# Kill the current server (Ctrl+C)
cd server
npm run dev
```

---

## Production Configuration

When deploying to production, you'll need to add the production redirect URI:

**Example for Google App Engine:**
```
https://your-app-name.appspot.com/auth/google/callback
```

**Example for custom domain:**
```
https://yourdomain.com/auth/google/callback
```

**Steps:**
1. Add the production URL to `.env.production`:
   ```
   GOOGLE_CALLBACK_URL="https://your-app-name.appspot.com/auth/google/callback"
   ```

2. Add the same URL to Google Cloud Console **Authorized redirect URIs**

3. Keep the localhost URL for development

---

## Verification Steps

After making changes:

1. ✅ **Check `.env` file:**
   ```bash
   cat server/.env | grep GOOGLE_CALLBACK_URL
   ```
   Should show: `http://localhost:8080/auth/google/callback`

2. ✅ **Check Google Cloud Console:**
   - OAuth 2.0 Client should have the same redirect URI

3. ✅ **Test the flow:**
   - Visit: http://localhost:3000/login
   - Click "Sign in with Google"
   - Should redirect without errors

---

## Common Mistakes to Avoid

❌ **Don't use `/api/auth/google/callback`** (incorrect - has extra `/api`)
✅ **Use `/auth/google/callback`** (correct - matches your routes)

❌ **Don't use `https://` for localhost**
✅ **Use `http://` for localhost**

❌ **Don't forget to save changes in Google Cloud Console**
✅ **Always click "Save" button after editing**

❌ **Don't use different ports**
✅ **Keep port 8080 consistent** (both in .env and Google Console)

---

## Current OAuth URLs in Your App

| Purpose | URL |
|---------|-----|
| Initiate OAuth | `http://localhost:8080/auth/google` |
| OAuth Callback | `http://localhost:8080/auth/google/callback` |
| Logout | `http://localhost:8080/auth/logout` |
| Get Current User | `http://localhost:8080/auth/me` |

---

## Troubleshooting

### Still getting `redirect_uri_mismatch`?

1. **Double-check the URL matches exactly:**
   - Copy from `.env` file
   - Paste into Google Cloud Console
   - No extra spaces or characters

2. **Clear browser cache:**
   ```bash
   # Hard refresh in browser
   Cmd + Shift + R (Mac)
   Ctrl + Shift + R (Windows/Linux)
   ```

3. **Wait a few minutes:**
   - Google Cloud changes can take 1-2 minutes to propagate

4. **Check you're editing the correct Client ID:**
   - Your Client ID: `311510222867-jit07731s0civiiqk4fi4pfdb2jgd683.apps.googleusercontent.com`
   - Make sure you're editing the same one in Google Cloud Console

5. **Verify server is running on port 8080:**
   ```bash
   curl http://localhost:8080/health
   ```
   Should return: `{"status":"OK", ...}`

### Need to create OAuth credentials from scratch?

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: "Task Tracker Development"
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:8080
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:8080/auth/google/callback
   ```
7. Click **Create**
8. Copy the Client ID and Client Secret to your `.env` file

---

## Quick Fix Summary

1. ✅ Updated `.env` file (already done)
2. 🔄 Update Google Cloud Console redirect URI to: `http://localhost:8080/auth/google/callback`
3. 🔄 Restart backend server
4. 🔄 Test login flow

**Next Step:** Update Google Cloud Console with the correct redirect URI!
