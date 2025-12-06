# Task API Documentation

## Overview

Complete CRUD API for task management with JWT authentication and ownership verification.

---

## 🔐 Authentication

All task endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📍 Endpoints

### Base URL: `/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (with filtering) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

---

## 📖 Endpoint Details

### 1. Get All Tasks
**`GET /api/tasks`**

Fetch all tasks for the authenticated user with optional filtering and search.

**Query Parameters:**
- `status` (optional) - Filter by status: `To Do`, `In Progress`, `Done`
- `priority` (optional) - Filter by priority: `Low`, `Medium`, `High`
- `search` (optional) - Search in title and description (case-insensitive)

**Examples:**
```bash
# Get all tasks
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks

# Filter by status
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?status=To Do"

# Search tasks
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?search=meeting"

# Combine filters
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?status=In Progress&priority=High"
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "tasks": [
    {
      "id": 1,
      "title": "Complete project proposal",
      "description": "Write and submit the Q4 proposal",
      "dueDate": "2025-12-15T00:00:00.000Z",
      "priority": "High",
      "status": "In Progress",
      "userId": 1,
      "createdAt": "2025-12-07T10:30:00.000Z",
      "updatedAt": "2025-12-07T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Task
**`GET /api/tasks/:id`**

Fetch a specific task by ID. Only the task owner can view it.

**Examples:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks/1
```

**Success Response (200):**
```json
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Complete project proposal",
    "description": "Write and submit the Q4 proposal",
    "dueDate": "2025-12-15T00:00:00.000Z",
    "priority": "High",
    "status": "In Progress",
    "userId": 1,
    "createdAt": "2025-12-07T10:30:00.000Z",
    "updatedAt": "2025-12-07T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Task not found
- `403` - Not the task owner

---

### 3. Create Task
**`POST /api/tasks`**

Create a new task for the authenticated user.

**Required Fields:**
- `title` (string) - Task title

**Optional Fields:**
- `description` (string) - Task description
- `dueDate` (ISO 8601 date string) - Due date
- `priority` (string) - `Low`, `Medium`, or `High` (default: `Medium`)
- `status` (string) - `To Do`, `In Progress`, or `Done` (default: `To Do`)

**Example:**
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review code",
    "description": "Review PR #123",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2025-12-10T18:00:00.000Z"
  }' \
  http://localhost:8080/api/tasks
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "id": 5,
    "title": "Review code",
    "description": "Review PR #123",
    "dueDate": "2025-12-10T18:00:00.000Z",
    "priority": "High",
    "status": "To Do",
    "userId": 1,
    "createdAt": "2025-12-07T12:00:00.000Z",
    "updatedAt": "2025-12-07T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing or invalid title
- `400` - Invalid priority value
- `400` - Invalid status value
- `400` - Invalid date format

---

### 4. Update Task
**`PUT /api/tasks/:id`**

Update an existing task. Only the task owner can update it.

**Optional Fields:**
- `title` (string)
- `description` (string)
- `dueDate` (ISO 8601 date string)
- `priority` (string) - `Low`, `Medium`, or `High`
- `status` (string) - `To Do`, `In Progress`, or `Done`

**Example:**
```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Done",
    "priority": "Medium"
  }' \
  http://localhost:8080/api/tasks/5
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "id": 5,
    "title": "Review code",
    "description": "Review PR #123",
    "dueDate": "2025-12-10T18:00:00.000Z",
    "priority": "Medium",
    "status": "Done",
    "userId": 1,
    "createdAt": "2025-12-07T12:00:00.000Z",
    "updatedAt": "2025-12-07T14:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid task ID
- `404` - Task not found
- `403` - Not the task owner
- `400` - Invalid priority or status value

---

### 5. Delete Task
**`DELETE /api/tasks/:id`**

Delete a task. Only the task owner can delete it.

**Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks/5
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `400` - Invalid task ID
- `404` - Task not found
- `403` - Not the task owner

---

## 🛡️ Security Features

### ✅ Implemented Security

1. **JWT Authentication** - All endpoints require valid JWT token
2. **Ownership Verification** - Users can only view/edit/delete their own tasks
3. **Input Validation** - Required fields checked, enum values validated
4. **SQL Injection Protection** - Prisma ORM prevents SQL injection
5. **User Isolation** - Tasks filtered by userId automatically

### 🔒 Access Control

| Action | Rule |
|--------|------|
| View task | Must be task owner |
| Create task | Must be authenticated |
| Update task | Must be task owner |
| Delete task | Must be task owner |

---

## 📊 Valid Field Values

### Priority
- `Low`
- `Medium` (default)
- `High`

### Status
- `To Do` (default)
- `In Progress`
- `Done`

---

## 🧪 Testing with cURL

### Setup
```bash
# 1. Login and get token
# Visit: http://localhost:8080/auth/google
# Extract token from redirect URL

# 2. Set token variable
TOKEN="your-jwt-token-here"
```

### Test CRUD Operations
```bash
# Create a task
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"High"}' \
  http://localhost:8080/api/tasks

# Get all tasks
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks

# Get specific task
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks/1

# Update task
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Done"}' \
  http://localhost:8080/api/tasks/1

# Delete task
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks/1
```

### Test Filtering
```bash
# Filter by status
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?status=To%20Do"

# Filter by priority
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?priority=High"

# Search tasks
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?search=meeting"

# Combined filters
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/tasks?status=In%20Progress&priority=High&search=project"
```

---

## ❌ Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable error message"
}
```

### Common Error Types
- `ValidationError` - Invalid input data
- `NotFound` - Resource not found
- `Forbidden` - Insufficient permissions
- `Unauthorized` - Invalid or missing token
- `ServerError` - Internal server error

---

## 💡 Frontend Integration Example

```javascript
// API client setup
const API_URL = 'http://localhost:8080/api/tasks';
const token = localStorage.getItem('token');

// Get all tasks
async function getTasks(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}

// Create task
async function createTask(taskData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  return response.json();
}

// Update task
async function updateTask(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return response.json();
}

// Delete task
async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}
```

---

## ✅ API Complete!

The Task API is fully functional with:
- ✅ Full CRUD operations
- ✅ JWT authentication on all endpoints
- ✅ Ownership verification
- ✅ Advanced filtering (status, priority, search)
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ Security best practices

Ready for frontend integration! 🚀
