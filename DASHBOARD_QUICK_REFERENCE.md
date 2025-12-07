# 🎯 Dashboard Quick Reference

## Component: `/client/src/pages/dashboard.js`

---

## State Variables

```javascript
const [user, setUser] = useState(null); // Current user from JWT
const [tasks, setTasks] = useState([]); // Array of tasks
const [loading, setLoading] = useState(true); // Loading indicator
const [searchQuery, setSearchQuery] = useState(""); // Search text
const [statusFilter, setStatusFilter] = useState(""); // Status filter
const [darkMode, setDarkMode] = useState(false); // Dark mode toggle
const [deleting, setDeleting] = useState(null); // Track deleting task ID
```

---

## Key Functions

### toggleDarkMode()

- Toggles dark/light mode
- Saves to localStorage
- Adds/removes 'dark' class on `<html>`

### handleLogout()

- Removes JWT token
- Redirects to `/login`

### handleDeleteTask(taskId)

- Shows confirmation dialog
- Calls `deleteTask(taskId)` API
- Removes from local state
- Shows loading spinner

### getPriorityColor(priority)

Returns Tailwind classes for priority badges:

- High → Red
- Medium → Yellow
- Low → Green

### getStatusColor(status)

Returns Tailwind classes for status badges:

- Done → Green
- In Progress → Blue
- To Do → Gray

---

## Effects

### Effect 1: Authentication & User

```javascript
useEffect(() => {
  if (!isAuthenticated()) router.push("/login");
  const userInfo = getUserFromToken();
  setUser(userInfo);
  // Load dark mode from localStorage
}, [router]);
```

### Effect 2: Fetch Tasks

```javascript
useEffect(() => {
  if (!user) return;
  fetchTasks({ status: statusFilter, search: searchQuery });
}, [user, statusFilter, searchQuery]);
```

---

## UI Sections

### 1. Navbar

- Logo + Title
- User profile pic + name
- Dark mode toggle (Sun/Moon)
- Logout button

### 2. Search & Filters

- Search input (with icon)
- Status dropdown
- Add Task button

### 3. Task List

- Loading spinner
- Empty state
- Task cards with:
  - Title (bold)
  - Description
  - Priority badge
  - Status badge
  - Due date
  - Delete button

---

## API Calls

```javascript
// Fetch tasks
const data = await getTasks({ status, search });

// Delete task
await deleteTask(taskId);
```

---

## Dark Mode Classes

Every element uses Tailwind dark mode variants:

```javascript
// Background
"bg-white dark:bg-gray-800";

// Text
"text-gray-900 dark:text-white";

// Border
"border-gray-200 dark:border-gray-700";

// Hover
"hover:bg-gray-100 dark:hover:bg-gray-700";
```

---

## Badge Colors

### Priority

```javascript
High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
```

### Status

```javascript
Done:        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
In Progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
To Do:       "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
```

---

## Responsive Breakpoints

```javascript
sm:   // Small screens (640px+)
md:   // Medium screens (768px+)
lg:   // Large screens (1024px+)
```

Example:

```javascript
"hidden sm:flex"; // Hidden on mobile, flex on small+
```

---

## Loading States

### Main Loading (No user)

```javascript
if (!user) return <Spinner />;
```

### Task Loading

```javascript
{
  loading ? <Spinner /> : <TaskList />;
}
```

### Delete Loading

```javascript
{
  deleting === task.id ? <Spinner /> : <TrashIcon />;
}
```

---

## User Flow

```
1. User logs in → JWT stored
2. Dashboard loads → Auth check
3. User info extracted from JWT
4. Tasks fetched from API
5. User can:
   - Search tasks
   - Filter by status
   - Toggle dark mode
   - Delete tasks
   - Logout
```

---

## Future: Add Task Modal

To connect the "Add Task" button:

```javascript
const [showModal, setShowModal] = useState(false);

<button onClick={() => setShowModal(true)}>
  <Plus /> Add Task
</button>;

{
  showModal && <TaskModal onClose={() => setShowModal(false)} />;
}
```

---

## Testing Commands

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Visit dashboard
open http://localhost:3000/dashboard
```

---

## Dependencies

```javascript
// React
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Auth utils
import { isAuthenticated, getUserFromToken, removeToken } from "@/utils/auth";

// API utils
import { getTasks, deleteTask } from "@/utils/taskApi";

// Icons
import { Trash2, Search, Sun, Moon, Plus } from "lucide-react";
```

---

## Quick Fixes

### Dark mode not working?

- Check `document.documentElement.classList`
- Verify localStorage has `darkMode` key

### Tasks not loading?

- Check backend is running (port 8080)
- Verify JWT token in localStorage
- Check Network tab for API calls

### Delete not working?

- Check console for errors
- Verify `deleteTask` API function
- Ensure task ownership matches user

---

## File Size

- **Total Lines:** ~250
- **Functions:** 5
- **State Variables:** 7
- **Effects:** 2
- **API Calls:** 2

---

**Last Updated:** December 7, 2025
**Status:** ✅ Production Ready
