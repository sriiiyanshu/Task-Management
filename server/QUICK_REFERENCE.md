# 🚀 Quick Reference - Authentication System

## Authentication Flow Summary

```
1. User → Frontend "Login with Google" button
2. Frontend → Redirect to http://localhost:8080/auth/google
3. Server → Initiates Google OAuth
4. Google → User authorizes → Callback to server
5. Server → Finds/Creates user → Generates JWT
6. Server → Redirects to http://localhost:3000/auth/success?token={jwt}
7. Frontend → Extract token → Store in localStorage
8. Frontend → All API calls include: Authorization: Bearer {token}
```

---

## 📍 API Endpoints

| Method | Endpoint                | Auth Required | Description                   |
| ------ | ----------------------- | ------------- | ----------------------------- |
| `GET`  | `/health`               | ❌ No         | Server health check           |
| `GET`  | `/auth/google`          | ❌ No         | Start Google OAuth            |
| `GET`  | `/auth/google/callback` | ❌ No         | OAuth callback (auto)         |
| `GET`  | `/auth/logout`          | ❌ No         | Logout (client deletes token) |
| `GET`  | `/auth/me`              | ✅ Yes        | Get current user              |
| `GET`  | `/api/protected`        | ✅ Yes        | Test protected route          |

---

## 🔑 Using Protected Routes

### Frontend (JavaScript/React)

```javascript
// Store token after login
localStorage.setItem("token", tokenFromURL);

// Make authenticated request
const response = await fetch("http://localhost:8080/api/tasks", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

### Backend (Express Route)

```javascript
import { authenticateJWT } from "./middleware/auth.js";

// Protect any route
app.get("/api/tasks", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // User from JWT
  // ... your logic
});
```

---

## 🧪 Test Commands

```bash
# 1. Check server health
curl http://localhost:8080/health

# 2. Test OAuth (use browser)
open http://localhost:8080/auth/google

# 3. Test protected route (replace TOKEN)
TOKEN="your-jwt-here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/protected

# 4. Test /auth/me
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/auth/me
```

---

## 📦 Files Structure

```
server/src/
├── config/
│   ├── database.js      → Prisma client
│   ├── passport.js      → Google OAuth strategy
│   └── jwt.js           → JWT utilities
├── middleware/
│   └── auth.js          → JWT verification middleware
├── routes/
│   └── auth.js          → Auth endpoints
└── server.js            → Main app (integrated)
```

---

## ⚙️ Environment Variables

```env
PORT=8080
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:8080/auth/google/callback"
JWT_SECRET="your-32-char-secret"
CLIENT_URL="http://localhost:3000"
DATABASE_URL="postgresql://..."
```

---

## ✅ What's Ready

- ✅ Google OAuth working
- ✅ JWT generation (24h expiry)
- ✅ Protected route middleware
- ✅ User creation/login
- ✅ Token-based authentication
- ✅ Error handling

## 🎯 Next: Build Task CRUD API

Create `/api/tasks` endpoints:

- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

All protected with `authenticateJWT` middleware!
