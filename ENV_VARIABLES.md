# Environment Variables Reference

Complete reference for all environment variables used in TRADEY project.

---

## Frontend Environment Variables (Vercel)

All frontend variables must start with `VITE_` prefix to be accessible in the React app.

### Firebase Client SDK Configuration

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs` | Firebase Web API Key (safe to expose) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `vibe-hakaton.firebaseapp.com` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `vibe-hakaton` | Firebase project identifier |
| `VITE_FIREBASE_STORAGE_BUCKET` | `vibe-hakaton.firebasestorage.app` | Firebase Storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `225908111904` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | `1:225908111904:web:36ffedcbbdfd2ed0b85a45` | Firebase app identifier |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-1KRVHGJHVZ` | Google Analytics measurement ID |

### API Configuration

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-railway-url.up.railway.app/api` | Backend API base URL |

**Important Notes:**
- Replace `your-railway-url` with actual Railway deployment URL
- No trailing slash on `VITE_API_URL`
- All `VITE_*` variables are embedded at **build time** (not runtime)
- If you change any `VITE_*` variable, you must **rebuild** the frontend

### Example `.env` file for frontend:

```env
# Firebase Client SDK (for Authentication only)
VITE_FIREBASE_API_KEY=AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs
VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vibe-hakaton
VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=225908111904
VITE_FIREBASE_APP_ID=1:225908111904:web:36ffedcbbdfd2ed0b85a45
VITE_FIREBASE_MEASUREMENT_ID=G-1KRVHGJHVZ

# Backend API URL
VITE_API_URL=http://localhost:5000/api  # Development
# VITE_API_URL=https://tradey-backend-production.up.railway.app/api  # Production
```

---

## Backend Environment Variables (Railway)

### Server Configuration

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `NODE_ENV` | `production` | Node environment mode | Yes |
| `PORT` | `5000` | Server port (Railway auto-assigns, but we force 5000) | Yes |

### Firebase Admin SDK Configuration

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `FIREBASE_PROJECT_ID` | `vibe-hakaton` | Firebase project ID | Yes |
| `FIREBASE_SERVICE_ACCOUNT` | `{...JSON content...}` | **Entire** `firebase-service-account.json` as JSON string | Yes* |
| `FIREBASE_ADMIN_KEY_PATH` | `/app/firebase-service-account.json` | Path to service account file (Docker only) | No** |

**Notes:**
- *Either `FIREBASE_SERVICE_ACCOUNT` (env variable) OR `FIREBASE_ADMIN_KEY_PATH` (file) is required
- **For Railway: Use `FIREBASE_SERVICE_ACCOUNT` (recommended)**
- **For local Docker: Use `FIREBASE_ADMIN_KEY_PATH`**

### CORS Configuration

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `CORS_ORIGIN` | `https://tradey-xyz.vercel.app` | Allowed frontend origin(s) | Yes |

**CORS_ORIGIN Formats:**

**Single domain:**
```
CORS_ORIGIN=https://tradey-xyz.vercel.app
```

**Multiple domains (comma-separated):**
```
CORS_ORIGIN=https://tradey-xyz.vercel.app,https://tradey.rs,https://www.tradey.rs
```

**Important:**
- No trailing slashes!
- Must match **exactly** with frontend URL (including `https://`)
- If using custom domain, add it here after domain is configured

### Example `.env` file for backend:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=vibe-hakaton

# Option 1: Use environment variable (recommended for Railway)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"vibe-hakaton",...}

# Option 2: Use file path (for local Docker)
# FIREBASE_ADMIN_KEY_PATH=/app/firebase-service-account.json

# CORS Configuration
CORS_ORIGIN=https://tradey-xyz.vercel.app  # Update with your Vercel URL
```

---

## How to Get Firebase Service Account JSON

### Method 1: Copy from Local File

1. Open `backend/firebase-service-account.json` in a text editor
2. **Select all** content (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)
4. Paste directly into Railway environment variable field

### Method 2: Download from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **vibe-hakaton**
3. Click **⚙️ Settings** → **Project settings**
4. Go to **Service accounts** tab
5. Click **"Generate new private key"**
6. Download the JSON file
7. Open in text editor and copy all content

**Security Warning:** This file contains sensitive credentials. Never commit to Git!

---

## Environment Variable Setup by Platform

### Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `VITE_FIREBASE_API_KEY`
   - **Value**: `AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs`
   - **Environment**: Select **Production**, **Preview**, **Development** (all)
4. Click **Save**
5. Repeat for all `VITE_*` variables
6. **Important:** Redeploy after adding variables!

### Railway (Backend)

1. Go to [railway.app](https://railway.app) → Your Project
2. Click on your service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add each variable:
   - **Variable**: `NODE_ENV`
   - **Value**: `production`
6. Click **Add**
7. Repeat for all backend variables
8. Railway auto-redeploys when you add/change variables

---

## Local Development Setup

### Frontend (local)

Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs
VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vibe-hakaton
VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=225908111904
VITE_FIREBASE_APP_ID=1:225908111904:web:36ffedcbbdfd2ed0b85a45
VITE_FIREBASE_MEASUREMENT_ID=G-1KRVHGJHVZ
VITE_API_URL=http://localhost:5000/api
```

### Backend (local)

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=vibe-hakaton
FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
CORS_ORIGIN=http://localhost:5173
```

**Don't forget:** Place `firebase-service-account.json` in `backend/` directory!

---

## Validation Checklist

### Frontend Variables ✅

- [ ] All `VITE_FIREBASE_*` variables are set
- [ ] `VITE_API_URL` points to correct backend URL
- [ ] No trailing slash on `VITE_API_URL`
- [ ] Variables are set in Vercel dashboard
- [ ] Frontend has been redeployed after adding variables

### Backend Variables ✅

- [ ] `NODE_ENV` is set to `production`
- [ ] `PORT` is set to `5000`
- [ ] `FIREBASE_PROJECT_ID` is set
- [ ] `FIREBASE_SERVICE_ACCOUNT` contains valid JSON
- [ ] `CORS_ORIGIN` matches frontend URL exactly
- [ ] Variables are set in Railway dashboard
- [ ] Backend has been redeployed after adding variables

---

## Testing Environment Variables

### Test Frontend Variables

Open browser console on your Vercel URL and run:
```javascript
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID)
```

Should output your configured values.

### Test Backend Variables

Check Railway deployment logs for:
```
📦 Loading Firebase credentials from environment variable...
✅ Firebase Admin SDK initialized successfully
🌍 CORS allowed origins: ['https://tradey-xyz.vercel.app', ...]
🚀 Server running on port 5000
```

If you see these messages, environment variables are configured correctly!

---

## Common Mistakes

### ❌ Frontend: Variable without `VITE_` prefix

**Wrong:**
```env
API_URL=https://backend.railway.app
```

**Correct:**
```env
VITE_API_URL=https://backend.railway.app
```

Vite only exposes variables starting with `VITE_`.

### ❌ Backend: CORS with trailing slash

**Wrong:**
```env
CORS_ORIGIN=https://tradey.vercel.app/
```

**Correct:**
```env
CORS_ORIGIN=https://tradey.vercel.app
```

CORS requires exact match, including trailing slash.

### ❌ Backend: Invalid JSON in FIREBASE_SERVICE_ACCOUNT

**Wrong:**
```json
{
  "type": "service_account",
  "project_id": "vibe-hakaton"
  "private_key_id": "..."  // Missing comma!
}
```

**Correct:**
```json
{
  "type": "service_account",
  "project_id": "vibe-hakaton",
  "private_key_id": "..."
}
```

Use a JSON validator if unsure.

### ❌ Frontend: Changing env variable without rebuilding

Environment variables are embedded at **build time**.

**Solution:** Always redeploy frontend after changing `VITE_*` variables in Vercel.

---

## Security Best Practices

1. **Never commit `.env` files to Git**
   - Already in `.gitignore` ✅

2. **Never commit `firebase-service-account.json`**
   - Already in `.gitignore` ✅

3. **Use environment variables for all secrets**
   - API keys, database credentials, etc.

4. **Rotate credentials periodically**
   - Generate new Firebase service account keys every 90 days

5. **Limit CORS origins**
   - Only add domains you control
   - Never use `*` (allow all) in production

6. **Use different Firebase projects for dev/production**
   - Prevents accidental data corruption
   - Better security isolation

---

## Quick Reference

### All Frontend Variables (9 total)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_API_URL
```

### All Backend Variables (5 total)
```
NODE_ENV
PORT
FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT
CORS_ORIGIN
```

### Total: 14 environment variables

---

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.
