# Authentication System Documentation

## ✅ Implementation Complete

The Google OAuth + JWT authentication system has been fully implemented and integrated into the server.

---

## 📁 Files Created

### 1. **`src/config/passport.js`**

Passport.js configuration with Google OAuth Strategy

- Authenticates users via Google OAuth
- Finds existing users by `googleId`
- Creates new users if they don't exist
- Stores user info: email, name, googleId, picture

### 2. **`src/config/jwt.js`**

JWT utility functions

- `generateToken(user)` - Creates JWT with 24-hour expiration
- `verifyToken(token)` - Verifies and decodes JWT
- `decodeToken(token)` - Decodes without verification (debugging)

### 3. **`src/routes/auth.js`**

Authentication routes

- `GET /auth/google` - Initiates Google OAuth
- `GET /auth/google/callback` - Handles OAuth callback, generates JWT
- `GET /auth/logout` - Logout endpoint
- `GET /auth/me` - Get current user info (protected)

### 4. **`src/middleware/auth.js`**

JWT authentication middleware

- `authenticateJWT` - Verifies Bearer token from Authorization header
- `optionalAuth` - Optional authentication (doesn't block if missing)

### 5. **`src/server.js` (Updated)**

Integrated authentication into Express app

- Imported Passport and auth routes
- Initialized Passport middleware
- Mounted auth routes at `/auth`
- Added example protected route at `/api/protected`

---

## 🔐 Authentication Flow

### 1. **User Initiates Login**

```
Frontend → GET http://localhost:8080/auth/google
```

- User clicks "Login with Google" button
- Frontend redirects to `/auth/google`
- Passport initiates Google OAuth flow

### 2. **Google OAuth**

```
Server → Google OAuth → User Authorization → Callback
```

- User authorizes the app on Google
- Google redirects to `/auth/google/callback` with auth code
- Passport exchanges code for user profile

### 3. **User Creation/Login**

```javascript
// In passport.js GoogleStrategy callback
- Find user by googleId
- If not found, create new user with:
  - email
  - googleId
  - name
  - picture (optional)
```

### 4. **JWT Generation & Redirect**

```
Server → Generates JWT → Redirects to Frontend
```

```
Redirect URL: http://localhost:3000/auth/success?token={jwt}
```

### 5. **Frontend Token Storage**

```javascript
// Frontend should extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
localStorage.setItem("token", token);
```

### 6. **Authenticated Requests**

```javascript
// All subsequent API requests include token
fetch("http://localhost:8080/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🔧 Usage Examples

### **Protect a Route**

```javascript
import { authenticateJWT } from "./middleware/auth.js";

// Any route using this middleware requires valid JWT
app.get("/api/tasks", authenticateJWT, (req, res) => {
  // req.user contains authenticated user data
  const userId = req.user.id;
  // ... fetch tasks for this user
});
```

### **Access User Info in Controllers**

```javascript
export const getUserTasks = async (req, res) => {
  const userId = req.user.id; // Set by authenticateJWT middleware

  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  res.json({ success: true, tasks });
};
```

### **Optional Authentication**

```javascript
import { optionalAuth } from "./middleware/auth.js";

// Route works with or without token
app.get("/api/public", optionalAuth, (req, res) => {
  if (req.user) {
    // User is logged in
    res.json({ message: `Hello, ${req.user.name}` });
  } else {
    // Anonymous user
    res.json({ message: "Hello, guest" });
  }
});
```

---

## 🌐 API Endpoints

### **Public Endpoints**

#### `GET /auth/google`

Initiates Google OAuth flow

```bash
# Redirect user to this URL
http://localhost:8080/auth/google
```

#### `GET /auth/google/callback`

OAuth callback (handled automatically by Google)

- Generates JWT on success
- Redirects to: `${CLIENT_URL}/auth/success?token={jwt}`
- Redirects on error: `${CLIENT_URL}/login?error=auth_failed`

#### `GET /auth/logout`

Logout endpoint (client should delete token)

```bash
curl http://localhost:8080/auth/logout
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully. Please remove the token from client storage."
}
```

### **Protected Endpoints**

#### `GET /auth/me`

Get current user information (requires JWT)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/auth/me
```

Response:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://...",
    "createdAt": "2025-12-07T..."
  }
}
```

#### `GET /api/protected` (Example)

Test protected route

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/protected
```

---

## 🔑 JWT Token Details

### Token Payload

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1702123456,
  "exp": 1702209856
}
```

### Token Expiration

- Default: **24 hours**
- Configured in `src/config/jwt.js`

### Error Responses

**Missing Token:**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "No authorization header provided"
}
```

**Invalid Format:**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid authorization format. Use: Bearer <token>"
}
```

**Expired Token:**

```json
{
  "success": false,
  "error": "TokenExpired",
  "message": "Your session has expired. Please login again."
}
```

**Invalid Token:**

```json
{
  "success": false,
  "error": "InvalidToken",
  "message": "Invalid authentication token"
}
```

---

## 🧪 Testing Authentication

### 1. **Test Server is Running**

```bash
curl http://localhost:8080/health
```

### 2. **Initiate OAuth (Browser)**

Navigate to:

```
http://localhost:8080/auth/google
```

### 3. **Extract Token from Redirect**

After Google auth, you'll be redirected to:

```
http://localhost:3000/auth/success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. **Test Protected Endpoint**

```bash
TOKEN="your-jwt-token-here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/protected
```

### 5. **Test Invalid Token**

```bash
curl -H "Authorization: Bearer invalid-token" \
  http://localhost:8080/api/protected
```

---

## 🚨 Security Considerations

### ✅ Implemented

- JWT tokens expire after 24 hours
- Tokens signed with secret key from environment variable
- CORS configured to allow only specific origins
- User verification on every protected request
- Secure password-less authentication via Google

### ⚠️ Production Recommendations

1. **Use HTTPS** - Never send tokens over HTTP in production
2. **Secure JWT_SECRET** - Use a strong, random secret (at least 32 characters)
3. **Token Refresh** - Consider implementing refresh tokens for longer sessions
4. **Rate Limiting** - Add rate limiting to auth endpoints
5. **Logging** - Log authentication attempts and failures
6. **Token Revocation** - Consider adding a token blacklist for logout

---

## 🔄 Next Steps

Now that authentication is complete, you can:

1. **Create Task Routes** - Protected CRUD endpoints for tasks
2. **Add Validation** - Validate request bodies with express-validator
3. **Error Handling** - Centralized error handler for better error messages
4. **Frontend Integration** - Build Next.js pages to consume these APIs
5. **Testing** - Write integration tests for auth flow

---

## 📚 Environment Variables Required

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:8080/auth/google/callback"

# JWT
JWT_SECRET="your-secret-key-minimum-32-characters"

# Client
CLIENT_URL="http://localhost:3000"
```

---

## 🐛 Troubleshooting

### "Not allowed by CORS"

- Check `CLIENT_URL` in `.env`
- Verify frontend origin matches allowed origins in `server.js`

### "Invalid token"

- Token may be expired (24h limit)
- Check JWT_SECRET matches between token generation and verification
- Ensure token format is `Bearer <token>`

### "User not found"

- User may have been deleted from database
- Try logging in again to recreate user

### OAuth redirect fails

- Check `GOOGLE_CALLBACK_URL` matches Google Cloud Console settings
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

---

## ✨ Summary

You now have a fully functional authentication system with:

- ✅ Google OAuth integration
- ✅ JWT token generation (24h expiry)
- ✅ Protected routes with middleware
- ✅ User creation/login flow
- ✅ Frontend redirect with token
- ✅ Comprehensive error handling

Ready to build the Task CRUD API! 🚀
