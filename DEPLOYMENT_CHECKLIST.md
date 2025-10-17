# TRADEY Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## Pre-Deployment Checks

### Code Preparation

- [ ] All code changes are committed to Git
- [ ] Code is pushed to GitHub repository
- [ ] No sensitive files in Git (check `.gitignore`)
  - [ ] `firebase-service-account.json` is NOT committed
  - [ ] `.env` files are NOT committed
  - [ ] `node_modules/` is NOT committed
- [ ] All tests pass locally
  - [ ] Frontend: `cd frontend && npm run lint`
  - [ ] Backend: `cd backend && npm run lint`
- [ ] Local build succeeds
  - [ ] Frontend: `cd frontend && npm run build`
  - [ ] Backend: `cd backend && npm run build`

### Environment Variables Prepared

- [ ] `firebase-service-account.json` file is accessible
- [ ] All Firebase API keys are documented
- [ ] `.env` files are up to date

### Accounts & Services

- [ ] GitHub account with repository access
- [ ] Vercel account created and logged in
- [ ] Railway account created and logged in
- [ ] Firebase project exists (vibe-hakaton)

---

## Backend Deployment (Railway)

### Initial Setup

- [ ] Railway project created
- [ ] GitHub repository connected to Railway
- [ ] Root directory set to `backend`
- [ ] Railway detects Dockerfile

### Environment Variables

Add all these variables in Railway dashboard:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `FIREBASE_PROJECT_ID` = `vibe-hakaton`
- [ ] `FIREBASE_SERVICE_ACCOUNT` = (paste entire JSON from `firebase-service-account.json`)
- [ ] `CORS_ORIGIN` = `http://localhost:5173` (temporary, will update later)

### Deployment

- [ ] Railway deployment started
- [ ] Build logs show no errors
- [ ] Deployment completes successfully
- [ ] Railway URL generated (e.g., `https://tradey-backend-production.up.railway.app`)
- [ ] **Railway URL saved** (you'll need it for frontend)

### Backend Testing

- [ ] Health check works:
  - Open: `https://your-railway-url.up.railway.app/api/health`
  - Returns: `{"status":"OK", ...}`
- [ ] Backend logs show:
  - [ ] `✅ Firebase Admin SDK initialized successfully`
  - [ ] `🌍 CORS allowed origins: [...]`
  - [ ] `🚀 Server running on port 5000`

---

## Frontend Deployment (Vercel)

### Initial Setup

- [ ] Vercel project created
- [ ] GitHub repository connected to Vercel
- [ ] Framework preset: **Vite** (auto-detected)
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables

Add all these variables in Vercel dashboard → Settings → Environment Variables:

- [ ] `VITE_FIREBASE_API_KEY` = `AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` = `vibe-hakaton.firebaseapp.com`
- [ ] `VITE_FIREBASE_PROJECT_ID` = `vibe-hakaton`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` = `vibe-hakaton.firebasestorage.app`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = `225908111904`
- [ ] `VITE_FIREBASE_APP_ID` = `1:225908111904:web:36ffedcbbdfd2ed0b85a45`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID` = `G-1KRVHGJHVZ`
- [ ] `VITE_API_URL` = `https://your-railway-url.up.railway.app/api` (use Railway URL from above)

### Deployment

- [ ] All environment variables added
- [ ] Vercel deployment started
- [ ] Build logs show no errors
- [ ] Deployment completes successfully
- [ ] Vercel URL generated (e.g., `https://tradey-xyz.vercel.app`)
- [ ] **Vercel URL saved** (you'll need it for backend CORS)

### Frontend Testing

- [ ] Open Vercel URL in browser
- [ ] Landing page loads without errors
- [ ] No errors in browser console
- [ ] Check Network tab: API calls go to Railway URL

---

## Post-Deployment Configuration

### Update Backend CORS

- [ ] Go to Railway dashboard → Variables
- [ ] Update `CORS_ORIGIN` to Vercel URL: `https://tradey-xyz.vercel.app`
- [ ] Railway automatically redeploys
- [ ] Check Railway logs for:
  - `🌍 CORS allowed origins: ['https://tradey-xyz.vercel.app', ...]`

### Verify CORS

- [ ] Open Vercel URL in browser
- [ ] Open DevTools → Network tab
- [ ] Test an authenticated action (e.g., create post)
- [ ] Check response headers include `Access-Control-Allow-Origin`
- [ ] No CORS errors in console

---

## Functional Testing

### Authentication

- [ ] Sign up with new account works
- [ ] Log in with credentials works
- [ ] JWT token is included in API requests (check Network tab)
- [ ] Protected routes require authentication
- [ ] Log out works

### User Profile

- [ ] User profile loads
- [ ] Profile image displays
- [ ] Edit profile works
- [ ] Create new post works

### Post Management

- [ ] View all posts on landing page
- [ ] View single post detail page
- [ ] Like/unlike post works
- [ ] Image upload works (check Firebase Storage)
- [ ] Delete own post works

### Chat

- [ ] Chat list loads
- [ ] Send message works
- [ ] Receive message works (test with two accounts)
- [ ] Real-time updates work

### Following

- [ ] Follow user works
- [ ] Unfollow user works
- [ ] Following feed shows posts from followed users

---

## Performance Testing

### Backend Performance

- [ ] Health check responds in < 200ms
- [ ] API endpoints respond in < 500ms
- [ ] No memory leaks (check Railway metrics)

### Frontend Performance

- [ ] Initial page load < 3 seconds
- [ ] Images load quickly (compressed)
- [ ] No layout shifts (CLS)
- [ ] Smooth animations (60fps)

### Lighthouse Audit (Optional)

- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 80

---

## Security Verification

### Environment Variables

- [ ] No secrets in frontend code (use browser DevTools → Sources)
- [ ] `FIREBASE_SERVICE_ACCOUNT` not exposed in client
- [ ] API keys are valid and not compromised

### CORS Configuration

- [ ] CORS only allows your frontend domain
- [ ] No `*` (wildcard) in CORS origins

### Firebase Security

- [ ] Firestore rules require authentication for writes
- [ ] Storage rules require authentication for uploads
- [ ] Authentication methods are secure (email/password only, no anonymous)

### API Security

- [ ] All protected endpoints require `Authorization` header
- [ ] JWT tokens are validated on backend
- [ ] Invalid tokens are rejected (test with expired token)

---

## Monitoring Setup

### Railway Monitoring

- [ ] Check Railway dashboard → Metrics
- [ ] Monitor CPU usage
- [ ] Monitor memory usage
- [ ] Set up deployment notifications (Settings → Notifications)

### Vercel Monitoring

- [ ] Check Vercel dashboard → Analytics
- [ ] Monitor page views
- [ ] Monitor build times
- [ ] Set up deployment notifications (Settings → Notifications)

### Firebase Monitoring

- [ ] Check Firebase Console → Firestore → Usage
- [ ] Monitor read/write operations
- [ ] Check quota limits (free tier)
- [ ] Set up billing alerts (if using paid tier)

---

## Documentation Updates

- [ ] Update [README.md](./README.md) with production URLs
- [ ] Add deployment date to documentation
- [ ] Document any deployment issues encountered
- [ ] Update API documentation with production endpoints

---

## Optional: Custom Domain Setup

### Frontend Custom Domain (Vercel)

- [ ] Domain purchased (e.g., `tradey.rs`)
- [ ] Domain added in Vercel → Settings → Domains
- [ ] DNS records configured (A/CNAME records)
- [ ] SSL certificate issued (automatic)
- [ ] Domain verified and working
- [ ] Update Railway `CORS_ORIGIN` to include custom domain

### Backend Custom Domain (Railway)

- [ ] Domain purchased (e.g., `api.tradey.rs`)
- [ ] Domain added in Railway → Settings → Domains
- [ ] DNS records configured
- [ ] Update Vercel `VITE_API_URL` to custom domain
- [ ] Redeploy frontend

---

## Final Checks

### Production URLs Documented

- [ ] Frontend URL: `https://___________________`
- [ ] Backend URL: `https://___________________`
- [ ] Health Check: `https://___________________/api/health`

### Rollback Plan Prepared

- [ ] Know how to rollback frontend (Vercel → Deployments → Promote)
- [ ] Know how to rollback backend (Railway → Deployments → Redeploy)
- [ ] Have backup of `firebase-service-account.json`
- [ ] Have backup of all environment variables

### Team Notified

- [ ] Notify team that deployment is complete
- [ ] Share production URLs
- [ ] Share login credentials for testing (if needed)
- [ ] Document any known issues

---

## Post-Deployment Monitoring (First 24 Hours)

### Hour 1

- [ ] Check Railway logs for errors
- [ ] Check Vercel logs for errors
- [ ] Monitor Firebase usage spike
- [ ] Test all critical flows again

### Hour 6

- [ ] Check Railway metrics (CPU, memory)
- [ ] Check Vercel analytics (page views, errors)
- [ ] Review Firebase quota usage
- [ ] Address any reported issues

### Hour 24

- [ ] Review all metrics one final time
- [ ] Document any issues encountered
- [ ] Plan for next improvements
- [ ] Celebrate successful deployment! 🎉

---

## Common Issues & Quick Fixes

### Issue: CORS errors

**Quick Fix:**
1. Verify `CORS_ORIGIN` in Railway matches Vercel URL exactly
2. Redeploy backend
3. Hard refresh frontend (Ctrl+Shift+R)

### Issue: Firebase credentials error

**Quick Fix:**
1. Re-copy `FIREBASE_SERVICE_ACCOUNT` from file
2. Verify it's valid JSON (use JSON validator)
3. Update variable in Railway
4. Check Railway logs for success message

### Issue: Frontend shows old code

**Quick Fix:**
1. Vercel dashboard → Deployments
2. Click on latest deployment → Redeploy
3. Select "Use existing Build Cache: NO"
4. Clear browser cache

### Issue: Images not uploading

**Quick Fix:**
1. Check Firebase Console → Storage → Rules
2. Verify rules allow authenticated writes
3. Check Railway logs for Storage errors
4. Test with smaller image (< 1MB)

---

## Success Criteria

Deployment is successful when:

- ✅ Both frontend and backend are deployed and accessible
- ✅ All functional tests pass
- ✅ No errors in browser console
- ✅ No errors in Railway/Vercel logs
- ✅ CORS is configured correctly
- ✅ Authentication flow works end-to-end
- ✅ Data operations (posts, chat, follows) work
- ✅ Images upload to Firebase Storage
- ✅ Performance is acceptable (< 3s page load)
- ✅ Security checks pass

---

## Deployment Completion

**Deployed by:** ___________________

**Deployment date:** ___________________

**Production URLs:**
- Frontend: ___________________
- Backend: ___________________

**Notes:**
___________________
___________________
___________________

---

**Congratulations on deploying TRADEY to production!** 🚀

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For environment variables reference, see [ENV_VARIABLES.md](./ENV_VARIABLES.md)
