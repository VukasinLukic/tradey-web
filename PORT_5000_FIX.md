# Port 5000 Already in Use - Quick Fix

## Problem
```
Error listen EADDRINUSE: address already in use :::5000
```

## Solutions (Pick One)

### Solution 1: Kill Process via Task Manager (Recommended)
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Go to "Details" tab
3. Find "node.exe" or "ts-node" process
4. Right-click → "End Task"
5. Run `npm run dev` again

### Solution 2: Kill Process via PowerShell (Admin Required)
```powershell
# Run PowerShell as Administrator
netstat -ano | findstr :5000
# Note the PID (e.g., 15388)

taskkill /F /PID 15388
# Replace 15388 with your actual PID
```

### Solution 3: Change Backend Port (Temporary)
Edit `backend/.env`:
```
PORT=5001
```

Then update frontend API URL in `frontend/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

### Solution 4: Restart Computer
Sometimes the easiest solution! 😅

## Prevention
Always stop your dev server properly with `Ctrl + C` instead of closing the terminal window.
