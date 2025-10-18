# Quick Deploy Reference Card

Ultra-condensed deployment reference. For full details, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🚀 5-Minute Deploy Guide

### Step 1️⃣: Backend (Railway)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `tradey-web` repo
3. Settings → Root Directory: `backend`
4. Variables → Add these 5 variables:

```bash
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=vibe-hakaton
FIREBASE_SERVICE_ACCOUNT=<paste entire firebase-service-account.json content>
CORS_ORIGIN=http://localhost:5173
```

5. Wait for deployment → Copy Railway URL: tradey-web-production.up.railway.app


---

### Step 2️⃣: Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Add New Project → Import `tradey-web`
2. Settings → Root Directory: `frontend`
3. Environment Variables → Add these 8 variables:

```bash
VITE_FIREBASE_API_KEY=AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs
VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vibe-hakaton
VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=225908111904
VITE_FIREBASE_APP_ID=1:225908111904:web:36ffedcbbdfd2ed0b85a45
VITE_FIREBASE_MEASUREMENT_ID=G-1KRVHGJHVZ
VITE_API_URL=https://your-railway-url.up.railway.app/api  ← Use Railway URL
```

4. Click Deploy → Copy Vercel URL: `https://______.vercel.app`

---

### Step 3️⃣: Update CORS

1. Back to Railway → Variables
2. Update `CORS_ORIGIN` to your Vercel URL: `https://your-vercel-url.vercel.app`
3. Railway auto-redeploys ✅

---

### Step 4️⃣: Test

- Open Vercel URL in browser
- Sign up / Log in
- Create a post
- Upload image
- Check browser console (no errors = success ✅)

---

## 📋 Environment Variables Cheat Sheet

### Frontend (8 vars)
All start with `VITE_` and are set in **Vercel dashboard**.

### Backend (5 vars)
Set in **Railway dashboard**. Most important:
- `FIREBASE_SERVICE_ACCOUNT` = entire JSON (no file needed!)
- `CORS_ORIGIN` = your Vercel URL

---

## ❌ Common Mistakes

| Mistake | Fix |
|---------|-----|
| CORS error | Update `CORS_ORIGIN` in Railway to match Vercel URL exactly (no trailing `/`) |
| "Firebase init failed" | Re-paste `FIREBASE_SERVICE_ACCOUNT` JSON (must be valid JSON) |
| Frontend shows old code | Vercel → Deployments → Redeploy (clear cache) |
| 404 on routes | `vercel.json` missing → Already created ✅ |

---

## 🆘 Quick Fixes

**Health check:**
```bash
curl https://your-railway-url.up.railway.app/api/health
# Should return: {"status":"OK",...}
```

**Check logs:**
- Railway: Dashboard → Deployments → View Logs
- Vercel: Dashboard → Deployments → View Function Logs

**Rollback:**
- Railway: Deployments → Old deployment → Redeploy
- Vercel: Deployments → Old deployment → Promote to Production

---

## 📚 Full Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete guide (read this first!)
- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - All environment variables explained
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - What was changed

---

**That's it!** Your app should be live in ~10 minutes. 🎉

For troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting).
