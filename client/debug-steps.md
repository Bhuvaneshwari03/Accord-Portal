# Debug Steps for Authentication Issue

## Step 1: Check Backend Server
1. Open terminal and navigate to `server` directory
2. Run: `npm run dev`
3. Verify server starts on `http://localhost:5000`
4. Test health endpoint: `http://localhost:5000/health`

## Step 2: Test Backend API Directly
1. Open `client/test-auth.html` in browser
2. Fill out the form with test data
3. Click "Test Authentication"
4. Check if API calls are successful

## Step 3: Check Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Try to login/register
4. Look for console.log messages:
   - "Auth reducer: LOGIN_SUCCESS"
   - "Login/Registration successful, user:"
   - "AuthForms useEffect - isAuthenticated:"
   - "User authenticated, redirecting to dashboard..."

## Step 4: Check Network Tab
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try to login/register
4. Check if API calls are made to `/api/auth/login` or `/api/auth/register`
5. Verify response status is 200
6. Check response body contains `success: true`

## Step 5: Check Local Storage
1. Open browser dev tools (F12)
2. Go to Application tab > Local Storage
3. After login/register, check if `token` and `user` are stored

## Step 6: Check React DevTools
1. Install React DevTools browser extension
2. Open React DevTools
3. Check AuthProvider component state
4. Verify `isAuthenticated` is `true` after login

## Common Issues and Solutions

### Issue 1: Backend Not Running
**Symptoms:** Network error in console
**Solution:** Start backend server with `npm run dev` in server directory

### Issue 2: CORS Error
**Symptoms:** CORS error in console
**Solution:** Check backend CORS configuration

### Issue 3: API Response Format
**Symptoms:** API call succeeds but authentication fails
**Solution:** Check if response has `success: true` and proper data structure

### Issue 4: State Not Updating
**Symptoms:** Console shows successful API call but `isAuthenticated` remains false
**Solution:** Check AuthContext reducer and dispatch

### Issue 5: Navigation Not Working
**Symptoms:** `isAuthenticated` is true but no redirect
**Solution:** Check React Router setup and navigation logic

## Expected Console Output for Successful Login

```
Auth reducer: LOGIN_SUCCESS {user: {...}, token: "..."}
Login successful, user: {name: "...", email: "...", role: "..."}
AuthForms useEffect - isAuthenticated: true
User authenticated, redirecting to dashboard...
```

## Expected API Response Format

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science",
      "studentId": "STU2024001"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student","department":"CS","studentId":"STU001"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
