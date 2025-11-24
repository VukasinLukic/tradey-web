# Railway Deployment Guide for TRADEY

This guide explains how to deploy the TRADEY application (backend and frontend) to Railway.

## Overview

TRADEY consists of two separate services:
- **Backend**: Node.js/Express API with Firebase Admin SDK
- **Frontend**: React SPA built with Vite

Both services need to be deployed as separate Railway projects.

## Prerequisites

1. Railway account ([railway.app](https://railway.app))
2. GitHub repository with your code
3. Firebase project with Admin SDK credentials
4. Firebase service account JSON file

## Backend Deployment

### Step 1: Create New Railway Project

1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect the Dockerfile

### Step 2: Configure Root Directory

Since this is a monorepo, you need to set the root directory:

1. Go to your backend service settings
2. Click on "Settings" tab
3. Under "Build", set **Root Directory** to: `backend`
4. Save changes

### Step 3: Set Environment Variables

In the Railway dashboard, go to the "Variables" tab and add these environment variables:

```bash
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
CORS_ORIGIN=https://your-frontend-domain.railway.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**CRITICAL**: Add the Firebase Service Account JSON:

```bash
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"..."}
```

To get this value:
1. Open your `firebase-service-account.json` file
2. Copy the ENTIRE JSON content (all of it, including the curly braces)
3. Paste it as a single line into the `FIREBASE_SERVICE_ACCOUNT` variable in Railway
4. Make sure there are no line breaks - it should be one continuous string

### Step 4: Deploy

1. Railway will automatically deploy after you add the environment variables
2. Wait for the build to complete
3. Once deployed, Railway will provide a public URL like: `https://tradey-backend.railway.app`
4. Test the health endpoint: `https://tradey-backend.railway.app/api/health`

## Frontend Deployment

### Step 1: Create New Railway Project

1. Create a second Railway project for the frontend
2. Select "Deploy from GitHub repo"
3. Choose the same repository

### Step 2: Configure Root Directory

1. Go to your frontend service settings
2. Click on "Settings" tab
3. Under "Build", set **Root Directory** to: `frontend`
4. Save changes

### Step 3: Set Environment Variables

Add these build-time environment variables in Railway:

```bash
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=https://your-backend-domain.railway.app
```

**IMPORTANT**: Replace `https://your-backend-domain.railway.app` with the actual backend URL from Step 4 of backend deployment.

### Step 4: Update Backend CORS

After frontend is deployed:
1. Go back to your backend service in Railway
2. Update the `CORS_ORIGIN` variable to your frontend URL
3. Railway will automatically redeploy the backend

### Step 5: Deploy

1. Railway will automatically build and deploy the frontend
2. The frontend will be available at: `https://tradey-frontend.railway.app`

## Verification

### Backend Health Check
```bash
curl https://your-backend.railway.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-01-24T12:00:00.000Z"
}
```

### Frontend
Open your frontend URL in a browser and verify:
- Landing page loads
- Can navigate to login/signup
- Can authenticate (this confirms backend connection works)

## Troubleshooting

### Build fails with "firebase-service-account.json: not found"

**Solution**: This error means the Dockerfile is trying to copy the service account file. The fix has been applied in the latest Dockerfile - the file is no longer copied. Instead, credentials are loaded from the `FIREBASE_SERVICE_ACCOUNT` environment variable.

### Backend crashes on startup

Check Railway logs for errors. Common issues:
- Missing `FIREBASE_SERVICE_ACCOUNT` variable
- Invalid JSON in `FIREBASE_SERVICE_ACCOUNT` (make sure it's a single line with no breaks)
- Wrong `FIREBASE_PROJECT_ID`

### Frontend can't connect to backend

Check:
- `VITE_API_URL` is set correctly in frontend environment variables
- Backend `CORS_ORIGIN` matches frontend URL exactly (including https://)
- Backend health endpoint is accessible

### Firebase errors

Verify:
- All Firebase config values are correct
- Firebase service account has proper permissions in Firebase Console
- Storage bucket name matches your project

## Environment Variables Reference

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `vibe-hakaton` |
| `FIREBASE_SERVICE_ACCOUNT` | Full service account JSON | `{"type":"service_account",...}` |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://tradey.railway.app` |
| `ADMIN_USERNAME` | Admin dashboard username | `admin` |
| `ADMIN_PASSWORD` | Admin dashboard password | `your-password` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase web API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `vibe-hakaton` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | `project.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics measurement ID | `G-XXXXXXXXXX` |
| `VITE_API_URL` | Backend API URL | `https://backend.railway.app` |

## Security Notes

1. **Never commit** `firebase-service-account.json` to your repository
2. **Never commit** `.env` files with real credentials
3. Use Railway's environment variables for all secrets
4. The `.env.example` files are safe to commit as they contain only placeholders
5. Rotate your admin password regularly
6. Keep your Firebase service account key secure

## Cost Optimization

Railway offers $5/month free credit on the hobby plan. To stay within limits:
- Backend typically uses 0.5-1 GB RAM
- Frontend is served statically and uses minimal resources
- Monitor usage in Railway dashboard
- Consider upgrading if you exceed free tier limits

## Support

If you encounter issues:
1. Check Railway build logs for errors
2. Check runtime logs for backend crashes
3. Verify all environment variables are set correctly
4. Test the backend health endpoint
5. Check Firebase Console for API usage and errors
