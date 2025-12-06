# Client API Configuration - Complete Guide

## ✅ Setup Complete

The Next.js client is now configured with a complete API integration layer.

---

## 📁 Files Created

### 1. **`src/utils/api.js`**

Axios instance with automatic authentication

**Features:**

- Base URL from environment variable
- Automatic `Authorization: Bearer <token>` header
- Request/response interceptors
- Auto-logout on 401 errors
- Network error handling
- 10-second timeout

### 2. **`src/utils/auth.js`**

Authentication helper functions

**Functions:**

- `setToken(token)` - Save JWT to localStorage
- `getToken()` - Get JWT from localStorage
- `removeToken()` - Clear JWT
- `isAuthenticated()` - Check if user has token
- `decodeToken(token)` - Decode JWT payload
- `getUserFromToken()` - Get user info from token
- `isTokenExpired()` - Check if token expired

### 3. **`src/utils/taskApi.js`**

Task API service functions

**Functions:**

- `getTasks(filters)` - Get all tasks with filtering
- `getTask(id)` - Get single task
- `createTask(taskData)` - Create new task
- `updateTask(id, updates)` - Update task
- `deleteTask(id)` - Delete task
- `getCurrentUser()` - Get current user
- `logout()` - Logout

### 4. **`.env.local`**

Environment configuration

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5. **`.env.example`**

Template for other developers

---

## 🔧 How It Works

### Request Flow

```
Component/Page
    ↓
taskApi function (e.g., getTasks)
    ↓
api.js (Axios instance)
    ↓
Request Interceptor (adds Authorization header)
    ↓
Backend API (http://localhost:8080)
    ↓
Response Interceptor (handles errors)
    ↓
Component/Page
```

### Automatic Authentication

```javascript
// Request interceptor automatically adds this to EVERY request:
headers: {
  'Authorization': 'Bearer <token-from-localStorage>'
}
```

### Automatic Error Handling

```javascript
// On 401 Unauthorized:
- Remove token from localStorage
- Redirect to /login page

// On 403 Forbidden:
- Log error to console

// On network error:
- Log connection error
```

---

## 💻 Usage Examples

### 1. Authentication Flow

```javascript
// pages/auth/success.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { setToken } from "@/utils/auth";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Get token from URL query parameter
    const { token } = router.query;

    if (token) {
      // Save token to localStorage
      setToken(token);

      // Redirect to dashboard
      router.push("/dashboard");
    }
  }, [router]);

  return <div>Loading...</div>;
}
```

### 2. Fetching Tasks

```javascript
// pages/dashboard.js
import { useState, useEffect } from "react";
import { getTasks } from "@/utils/taskApi";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return <div>{loading ? <p>Loading...</p> : tasks.map((task) => <div key={task.id}>{task.title}</div>)}</div>;
}
```

### 3. Filtering Tasks

```javascript
import { getTasks } from "@/utils/taskApi";

// Filter by status
const response = await getTasks({ status: "To Do" });

// Filter by priority
const response = await getTasks({ priority: "High" });

// Search tasks
const response = await getTasks({ search: "meeting" });

// Combine filters
const response = await getTasks({
  status: "In Progress",
  priority: "High",
  search: "project",
});
```

### 4. Creating a Task

```javascript
import { createTask } from "@/utils/taskApi";

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await createTask({
      title: "Complete project",
      description: "Finish the task tracker app",
      priority: "High",
      status: "To Do",
      dueDate: "2025-12-15T00:00:00.000Z",
    });

    console.log("Task created:", response.data.task);
  } catch (error) {
    console.error("Error:", error.response?.data?.message);
  }
};
```

### 5. Updating a Task

```javascript
import { updateTask } from "@/utils/taskApi";

const handleStatusChange = async (taskId, newStatus) => {
  try {
    const response = await updateTask(taskId, {
      status: newStatus,
    });

    console.log("Task updated:", response.data.task);
  } catch (error) {
    console.error("Error:", error.response?.data?.message);
  }
};
```

### 6. Deleting a Task

```javascript
import { deleteTask } from "@/utils/taskApi";

const handleDelete = async (taskId) => {
  if (confirm("Are you sure you want to delete this task?")) {
    try {
      await deleteTask(taskId);
      console.log("Task deleted");
    } catch (error) {
      console.error("Error:", error.response?.data?.message);
    }
  }
};
```

### 7. Logout

```javascript
import { useRouter } from "next/router";
import { removeToken } from "@/utils/auth";

const handleLogout = () => {
  // Remove token from localStorage
  removeToken();

  // Redirect to login page
  router.push("/login");
};
```

### 8. Check Authentication

```javascript
import { isAuthenticated, isTokenExpired } from "@/utils/auth";

// In a component or page
useEffect(() => {
  if (!isAuthenticated() || isTokenExpired()) {
    router.push("/login");
  }
}, []);
```

### 9. Get Current User Info

```javascript
import { getUserFromToken } from "@/utils/auth";

const user = getUserFromToken();
console.log("User:", user);
// Output: { id: 1, email: 'user@example.com', name: 'John Doe' }
```

---

## 🔐 Protected Routes Pattern

Create a higher-order component to protect routes:

```javascript
// components/AuthGuard.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, isTokenExpired } from '@/utils/auth';

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || isTokenExpired()) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated()) {
    return <div>Loading...</div>;
  }

  return children;
}

// Usage in pages
export default function Dashboard() {
  return (
    <AuthGuard>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

---

## 🚀 Running the Client

### Development Mode

```bash
cd client
npm run dev
```

**Server runs on:** `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Environment Variables

### Development (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Production

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

**Note:** `NEXT_PUBLIC_` prefix makes the variable available in the browser.

---

## 📊 API Response Handling

### Success Response

```javascript
{
  success: true,
  tasks: [...],
  count: 5
}
```

### Error Response

```javascript
{
  success: false,
  error: "ValidationError",
  message: "Title is required"
}
```

### Handling in Component

```javascript
try {
  const response = await getTasks();
  // Access data: response.data.tasks
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data.message);
  } else {
    // Network error
    console.error("Network error");
  }
}
```

---

## 🧪 Testing the Setup

### 1. Start Backend

```bash
cd server
npm run dev
# Running on http://localhost:8080
```

### 2. Start Frontend

```bash
cd client
npm run dev
# Running on http://localhost:3000
```

### 3. Test API Connection

Create a test page at `pages/test-api.js`:

```javascript
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function TestAPI() {
  const [status, setStatus] = useState("Testing...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setStatus("✅ API Connected!"))
      .catch((err) => setStatus("❌ API Connection Failed"));
  }, []);

  return <h1>{status}</h1>;
}
```

Visit: `http://localhost:3000/test-api`

---

## ✅ What's Ready

- ✅ Axios instance configured
- ✅ Automatic authentication headers
- ✅ Token management utilities
- ✅ Task API service functions
- ✅ Error handling & auto-logout
- ✅ Environment configuration
- ✅ Next.js runs on port 3000
- ✅ Ready for component development

---

## 🎯 Next Steps

1. **Create Pages:**

   - `/login` - Login page with Google OAuth button
   - `/auth/success` - Handle OAuth callback & token
   - `/dashboard` - Main task dashboard
   - `/tasks/[id]` - Single task view

2. **Create Components:**

   - `TaskList` - Display tasks
   - `TaskCard` - Individual task
   - `TaskForm` - Create/edit tasks
   - `Navbar` - Navigation with logout
   - `AuthGuard` - Protected route wrapper

3. **Add Styling:**
   - Tailwind CSS for UI
   - Responsive design
   - Loading states
   - Error messages

---

## 📝 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev", // Runs on port 3000 by default
    "build": "next build", // Build for production
    "start": "next start", // Start production server
    "lint": "eslint" // Run linter
  }
}
```

---

**Client API setup is complete and ready for frontend development! 🚀**
