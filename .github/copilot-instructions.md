# Task Tracker Application - AI Agent Instructions

## Architecture Overview

This is a **full-stack Task Tracker application** built for a hiring assignment with separated client and server architecture.

**Tech Stack:**

- **Frontend:** Next.js (Pages Router) + Tailwind CSS
- **Backend:** Node.js with Express (ES modules)
- **Database:** PostgreSQL (Neon.tech) via Prisma ORM
- **Authentication:** Google OAuth (Passport.js) + JWT tokens
- **API Communication:** RESTful API between Next.js and Express

**Architecture Pattern:** Monorepo with separate `client/` and `server/` directories

## Folder Structure

```
task-management/
├── client/                      # Next.js frontend
│   ├── src/
│   │   ├── pages/              # Next.js pages (Pages Router)
│   │   │   ├── _app.js         # Global app wrapper
│   │   │   ├── _document.js    # Custom document
│   │   │   ├── index.js        # Landing/dashboard page
│   │   │   ├── login.js        # Login page
│   │   │   └── api/            # Next.js API routes (proxy to backend)
│   │   ├── components/         # React components
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── AuthGuard.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── useTasks.js
│   │   ├── utils/              # Client utilities
│   │   │   ├── api.js          # API client (axios)
│   │   │   └── auth.js         # Token management
│   │   └── styles/
│   │       └── globals.css     # Tailwind imports
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── index.js            # Express server entry
│   │   ├── config/             # Configuration files
│   │   │   ├── database.js     # Prisma client singleton
│   │   │   ├── passport.js     # Passport strategies
│   │   │   └── jwt.js          # JWT utilities
│   │   ├── routes/             # Express routes
│   │   │   ├── auth.routes.js  # OAuth & login endpoints
│   │   │   └── tasks.routes.js # CRUD for tasks
│   │   ├── controllers/        # Business logic
│   │   │   ├── auth.controller.js
│   │   │   └── tasks.controller.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   └── errorHandler.js
│   │   └── validators/         # Request validation
│   │       └── task.validator.js
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Migration history
│   ├── package.json
│   └── .env                    # Environment variables
│
├── .gitignore
└── README.md
```

## Development Workflows

### Initial Setup

```bash
# Install dependencies for both client and server
cd server && npm install
cd ../client && npm install

# Setup Prisma
cd ../server
npx prisma generate
npx prisma migrate dev --name init
```

### Running in Development

```bash
# Terminal 1 - Backend (runs on port 5000)
cd server
npm run dev

# Terminal 2 - Frontend (runs on port 3000)
cd client
npm run dev
```

### Database Management

```bash
cd server

# Create migration after schema changes
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Building for Production

```bash
# Build client
cd client && npm run build

# Run production server
cd ../server && npm start
```

## Code Conventions

### Backend (Express + Prisma)

**ES Modules:** All server code uses ES6 imports

```javascript
import express from "express";
import prisma from "./config/database.js";
```

**Route Pattern:** RESTful API design

```javascript
// server/src/routes/tasks.routes.js
router.get("/api/tasks", authenticateJWT, taskController.getAllTasks);
router.post("/api/tasks", authenticateJWT, validateTask, taskController.createTask);
router.put("/api/tasks/:id", authenticateJWT, taskController.updateTask);
router.delete("/api/tasks/:id", authenticateJWT, taskController.deleteTask);
```

**Controller Pattern:** Business logic separated from routes

```javascript
// server/src/controllers/tasks.controller.js
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};
```

**Prisma Client:** Always use singleton pattern

```javascript
// server/src/config/database.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;
```

### Frontend (Next.js + React)

**Component Organization:** Functional components with hooks

```javascript
// client/src/components/TaskCard.jsx
export default function TaskCard({ task, onUpdate, onDelete }) {
  // Component logic
}
```

**API Calls:** Centralized in `utils/api.js`

```javascript
// client/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

**Authentication Flow:**

1. User clicks "Login with Google" → redirects to `/api/auth/google`
2. Backend handles OAuth → returns JWT token
3. Frontend stores token in localStorage
4. All API requests include token in Authorization header
5. Protected pages use `AuthGuard.jsx` wrapper

## Database Schema (Prisma)

```prisma
// server/prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  googleId  String   @unique
  picture   String?
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("todo") // "todo", "in-progress", "completed"
  priority    String   @default("medium") // "low", "medium", "high"
  dueDate     DateTime?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Environment Variables

**Server (.env):**

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
CLIENT_URL="http://localhost:3000"
PORT=5000
```

**Client (.env.local):**

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## Key Integration Points

### Authentication Flow

1. **Frontend** → User clicks "Login with Google"
2. **Backend** → `/api/auth/google` (Passport.js initiates OAuth)
3. **Google** → User authorizes app
4. **Backend** → `/api/auth/google/callback` receives code, exchanges for profile
5. **Backend** → Creates/finds user in DB, generates JWT
6. **Backend** → Redirects to frontend with token (query param or cookie)
7. **Frontend** → Stores token, redirects to dashboard

### API Request Flow

```javascript
// Frontend makes authenticated request
const response = await api.get("/api/tasks");

// Backend middleware verifies JWT
app.use("/api/tasks", authenticateJWT, taskRoutes);

// Controller accesses user from req.user (set by middleware)
const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
```

## Production Considerations

- **CORS:** Configure Express to allow requests from Next.js domain
- **Rate Limiting:** Add `express-rate-limit` for API endpoints
- **Input Validation:** Use `express-validator` in all routes
- **Error Handling:** Centralized error handler catches Prisma and auth errors
- **Logging:** Use `winston` or `pino` for structured logging
- **Security:** Helmet.js for HTTP headers, bcrypt if adding password auth later
