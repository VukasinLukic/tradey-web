# TRADEY Deployment Guide

Complete step-by-step guide for deploying TRADEY to production using Vercel (frontend) and Railway (backend).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [x] GitHub repository with your TRADEY code
- [x] Vercel account (free tier works fine)
- [x] Railway account (free tier works fine)
- [x] Firebase project already set up
- [x] `firebase-service-account.json` file (for backend)
- [x] All environment variables from `.env` files

---

## Architecture Overview

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │ ← React + Vite
│   Port: N/A     │
└────────┬────────┘
         │ HTTPS API Calls
         │
┌────────▼────────┐
│   Railway       │
│   (Backend)     │ ← Express + Node.js
│   Port: 5000    │
└────────┬────────┘
         │
         │ Firebase Admin SDK
         │
┌────────▼────────────────────────┐
│  Firebase (Google Cloud)        │
│  • Firestore (Database)         │
│  • Storage (File uploads)       │
│  • Auth (Authentication)        │
└─────────────────────────────────┘
```

**Key Points:**
- Frontend uses Firebase Client SDK for **authentication only**
- Backend handles **all data operations** (Firestore, Storage)
- Backend validates JWT tokens from Firebase Auth
- Firebase is already hosted on Google Cloud (no deployment needed)

---

## Backend Deployment (Railway)

### Step 1: Prepare Firebase Service Account

Railway **cannot** use local files, so we'll use an environment variable instead.

1. Open `backend/firebase-service-account.json`
2. **Copy the entire JSON content** (all lines, including curly braces)
3. Keep it ready for the next step

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your `tradey-web` repository
6. Railway will automatically detect the repository

### Step 3: Configure Service Settings

1. After project is created, click on the service
2. Go to **Settings** tab
3. Under **"Root Directory"**, enter: `backend`
   - This is critical! Railway needs to know your Dockerfile is in `/backend`
4. Under **"Build"**, Railway should auto-detect Dockerfile
5. Click **"Save Changes"**

### Step 4: Add Environment Variables

In Railway dashboard, go to **Variables** tab and add these:

| Variable Name | Value |
|--------------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `FIREBASE_PROJECT_ID` | `vibe-hakaton` |
| `FIREBASE_SERVICE_ACCOUNT` | *Paste entire JSON from firebase-service-account.json* |
| `CORS_ORIGIN` | `https://tradey.vercel.app` (update after frontend deploy) |

**IMPORTANT for `FIREBASE_SERVICE_ACCOUNT`:**
- Paste the ENTIRE JSON content as a single-line string
- Example: `{"type":"service_account","project_id":"vibe-hakaton",...}`
- Do NOT add quotes around it - Railway will handle that

**Note:** We're using `FIREBASE_SERVICE_ACCOUNT` instead of `FIREBASE_ADMIN_KEY_PATH` because Railway can't access local files. The backend code now supports both methods.

### Step 5: Deploy Backend

1. Railway will automatically start deploying after you add variables
2. Watch the **Deployments** tab for build logs
3. Look for these success messages:
   ```
   ✅ Firebase Admin SDK initialized successfully
   🌍 CORS allowed origins: [...]
   🚀 Server running on port 5000
   ```
4. Once deployed, Railway will give you a URL like:
   ```
   https://tradey-backend-production.up.railway.app
   ```
5. **Save this URL** - you'll need it for frontend configuration

### Step 6: Test Backend Health Check

Open your browser and visit:
```
https://your-railway-url.up.railway.app/api/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-17T...",
  "uptime": 123.456,
  "environment": "production"
}
```

If you see this, your backend is **live and healthy**!

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your `tradey-web` GitHub repository
4. Vercel will auto-detect it's a Vite project

### Step 2: Configure Build Settings

Vercel should automatically detect these settings, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3: Add Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

| Variable Name | Value |
|--------------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `vibe-hakaton.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `vibe-hakaton` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `vibe-hakaton.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `225908111904` |
| `VITE_FIREBASE_APP_ID` | `1:225908111904:web:36ffedcbbdfd2ed0b85a45` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-1KRVHGJHVZ` |
| `VITE_API_URL` | `https://your-railway-url.up.railway.app/api` |

**IMPORTANT:**
- Replace `your-railway-url` with your actual Railway URL from Step 5 above
- All VITE_ variables must be set **before** build (they're embedded in the code at build time)
- Make sure there's no trailing slash on `VITE_API_URL`

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Watch the build logs for any errors
4. After deployment, you'll get a URL like:
   ```
   https://tradey-xyz.vercel.app
   ```
5. **Save this URL** - you need to update backend CORS with it

---

## Post-Deployment Configuration

### Step 1: Update Backend CORS

Now that you have your Vercel URL, you need to allow it in backend CORS:

1. Go back to **Railway dashboard**
2. Go to **Variables** tab
3. Update `CORS_ORIGIN` variable to your Vercel URL:
   ```
   CORS_ORIGIN=https://tradey-xyz.vercel.app
   ```
   (Replace with your actual Vercel URL)
4. Railway will automatically redeploy with new settings

**Optional:** If you want to allow multiple domains:
```
CORS_ORIGIN=https://tradey-xyz.vercel.app,https://tradey-custom-domain.com
```
(Comma-separated, no spaces)

### Step 2: Custom Domain (Optional)

**For Vercel (Frontend):**
1. Go to Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain (e.g., `tradey.rs`)
3. Follow Vercel's DNS configuration instructions
4. After domain is verified, update Railway `CORS_ORIGIN` to include it

**For Railway (Backend):**
1. Go to Railway dashboard → **Settings** → **Domains**
2. Click **"Generate Domain"** or add custom domain
3. Update Vercel's `VITE_API_URL` environment variable
4. Redeploy frontend on Vercel

---

## Testing & Verification

### Backend Tests

1. **Health Check:**
   ```bash
   curl https://your-railway-url.up.railway.app/api/health
   ```
   Should return 200 OK with JSON response

2. **Test Authentication (optional):**
   ```bash
   curl https://your-railway-url.up.railway.app/api/posts
   ```
   Should return 401 Unauthorized (because no token provided) - this is expected!

### Frontend Tests

1. Open your Vercel URL in browser
2. Check browser console for errors
3. Test these flows:
   - [x] Landing page loads
   - [x] Sign up with email/password
   - [x] Log in with credentials
   - [x] View user profile
   - [x] Create a new post
   - [x] Upload an image
   - [x] Like a post
   - [x] Send a chat message
   - [x] Log out

### Network Tests

1. Open browser DevTools → **Network** tab
2. Check that API calls go to your Railway URL
3. Check that requests include `Authorization: Bearer <token>` header
4. Verify 200 OK responses from backend

---

## Troubleshooting

### Problem: "Firebase Admin SDK initialization failed"

**Cause:** Invalid `FIREBASE_SERVICE_ACCOUNT` format or missing environment variable

**Solution:**
1. Check Railway logs: `Railway dashboard → Deployments → View Logs`
2. Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON (copy-paste directly from file)
3. Ensure all curly braces `{}` and quotes are preserved
4. Try re-adding the variable (delete and create new)

### Problem: CORS errors in browser console

**Example error:**
```
Access to fetch at 'https://railway-url/api/posts' from origin 'https://vercel-url'
has been blocked by CORS policy
```

**Solution:**
1. Check `CORS_ORIGIN` in Railway matches **exactly** your Vercel URL
2. No trailing slash: ✅ `https://tradey.vercel.app` ❌ `https://tradey.vercel.app/`
3. Check Railway logs to see what origins are allowed:
   ```
   🌍 CORS allowed origins: [...]
   ```
4. If you have a custom domain, add it to `CORS_ORIGIN` (comma-separated)

### Problem: Environment variables not working in frontend

**Cause:** Vite embeds env variables at **build time**, not runtime

**Solution:**
1. Go to Vercel dashboard → **Settings** → **Environment Variables**
2. Verify all `VITE_*` variables are set
3. Go to **Deployments** tab
4. Click **"Redeploy"** → **"Use existing Build Cache: NO"**
5. Force a fresh build with new environment variables

### Problem: "Cannot find module 'firebase-service-account.json'"

**Cause:** Railway is trying to load from file instead of environment variable

**Solution:**
1. Make sure `FIREBASE_SERVICE_ACCOUNT` environment variable is set in Railway
2. Remove `FIREBASE_ADMIN_KEY_PATH` variable (we're not using file path anymore)
3. Check Railway build logs - should show:
   ```
   📦 Loading Firebase credentials from environment variable...
   ```

### Problem: Images not uploading to Firebase Storage

**Possible causes:**
1. Backend cannot connect to Firebase Storage
2. CORS not configured for Storage bucket
3. Firebase Storage rules too restrictive

**Solution:**
1. Check Railway logs for Storage errors
2. Verify Firebase Storage bucket name in Railway variables
3. Check Firebase Console → **Storage** → **Rules**:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### Problem: Railway deployment failing during build

**Solution:**
1. Check Railway logs for specific error
2. Verify `Root Directory` is set to `backend`
3. Ensure `backend/Dockerfile` exists and is valid
4. Try deploying from Railway dashboard → **Deployments** → **Redeploy**

### Problem: Vercel build failing

**Common causes:**
1. TypeScript errors
2. Missing dependencies
3. Incorrect build settings

**Solution:**
1. Check Vercel build logs for specific error
2. Run `npm run build` locally in `/frontend` to test
3. Verify `Root Directory` is set to `frontend` in Vercel settings
4. Check that `vercel.json` exists in `/frontend` directory

---

## Monitoring & Logs

### Railway Logs
- Go to Railway dashboard → **Deployments** → Click on deployment → **View Logs**
- Look for:
  - `✅ Firebase Admin SDK initialized successfully`
  - `🚀 Server running on port 5000`
  - Any error messages in red

### Vercel Logs
- Go to Vercel dashboard → **Deployments** → Click on deployment → **View Function Logs**
- Build logs show compilation errors
- Runtime logs show server-side errors (if any)

### Firebase Logs
- Go to Firebase Console → **Firestore** → **Usage** tab
- Monitor read/write operations
- Check for quota limits (free tier has limits)

---

## Production URLs

After successful deployment, update these in your documentation:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://tradey-xyz.vercel.app` | User-facing web app |
| **Backend API** | `https://tradey-backend-production.up.railway.app` | REST API |
| **Health Check** | `https://backend-url/api/health` | Service health status |
| **Firebase Console** | `https://console.firebase.google.com` | Database/Storage admin |

---

## Security Checklist

- [x] `firebase-service-account.json` is in `.gitignore` (not committed)
- [x] `.env` files are in `.gitignore` (not committed)
- [x] All secrets are stored as environment variables in Railway/Vercel
- [x] CORS is configured to allow only your frontend domain
- [x] Firebase Storage rules require authentication for writes
- [x] Firebase Firestore rules are configured properly
- [x] Backend validates JWT tokens on all protected routes

---

## Rollback Plan

If something goes wrong after deployment:

### Rollback Frontend (Vercel)
1. Go to Vercel dashboard → **Deployments**
2. Find the last working deployment
3. Click **"⋮"** → **"Promote to Production"**
4. Previous version is now live

### Rollback Backend (Railway)
1. Go to Railway dashboard → **Deployments**
2. Find the last working deployment
3. Click **"Redeploy"** on that deployment
4. Railway will roll back to that version

---

## Next Steps

After successful deployment:

1. **Set up monitoring:**
   - Railway: Built-in metrics in dashboard
   - Vercel: Built-in analytics in dashboard
   - Consider: Sentry for error tracking

2. **Configure alerts:**
   - Railway: Set up notifications for deployment failures
   - Vercel: Enable deployment notifications

3. **Performance optimization:**
   - Enable Vercel Edge Network (automatic)
   - Consider Railway Pro for better performance
   - Optimize images with CDN

4. **Backup strategy:**
   - Firebase: Automatic backups (check Firestore settings)
   - Code: GitHub repository (already done)

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **TRADEY Repository:** Your GitHub repo URL

---

**Deployment completed!** 🎉

Your TRADEY platform is now live and accessible to users worldwide.
