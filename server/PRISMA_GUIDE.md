# Prisma Database Setup Guide

## ✅ Completed Setup

### Database Schema

The database has been initialized with two models:

**User Model:**

- `id` - Auto-incrementing integer (Primary Key)
- `email` - Unique string
- `googleId` - Unique string for OAuth
- `name` - String
- `tasks` - Relation to Task model (One-to-Many)
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-updated)

**Task Model:**

- `id` - Auto-incrementing integer (Primary Key)
- `title` - String (required)
- `description` - String (optional)
- `dueDate` - DateTime (optional)
- `priority` - String with default "Medium" (Low, Medium, High)
- `status` - String with default "To Do" (To Do, In Progress, Done)
- `userId` - Integer (Foreign Key to User)
- `user` - Relation to User model
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-updated)

## 🔧 Prisma Commands Reference

### Initial Setup (Already Completed)

```bash
# Initialize Prisma
npx prisma init

# Run migrations
npx prisma migrate dev --name init_user_and_task_models

# Generate Prisma Client (auto-runs after migrate)
npx prisma generate
```

### Common Commands for Future Use

**Create a new migration:**

```bash
npx prisma migrate dev --name <migration_name>
```

**Apply migrations to production:**

```bash
npx prisma migrate deploy
```

**Open Prisma Studio (Database GUI):**

```bash
npx prisma studio
```

**Reset database (WARNING: Deletes all data):**

```bash
npx prisma migrate reset
```

**Pull schema from existing database:**

```bash
npx prisma db pull
```

**Push schema without migrations (for prototyping):**

```bash
npx prisma db push
```

**Format schema file:**

```bash
npx prisma format
```

**Validate schema:**

```bash
npx prisma validate
```

## 💻 Using Prisma in Your Code

### Import the Prisma Client

```javascript
import prisma from "./config/database.js";
```

### Example Queries

**Create a User:**

```javascript
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    googleId: "google-oauth-id",
    name: "John Doe",
  },
});
```

**Find User by Email:**

```javascript
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  include: { tasks: true }, // Include related tasks
});
```

**Create a Task for a User:**

```javascript
const task = await prisma.task.create({
  data: {
    title: "Complete project",
    description: "Finish the task tracker app",
    priority: "High",
    status: "In Progress",
    dueDate: new Date("2025-12-31"),
    userId: user.id,
  },
});
```

**Get All Tasks for a User:**

```javascript
const tasks = await prisma.task.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: "desc" },
});
```

**Update a Task:**

```javascript
const updatedTask = await prisma.task.update({
  where: { id: taskId },
  data: {
    status: "Done",
    priority: "Low",
  },
});
```

**Delete a Task:**

```javascript
await prisma.task.delete({
  where: { id: taskId },
});
```

**Filter Tasks:**

```javascript
const urgentTasks = await prisma.task.findMany({
  where: {
    userId: user.id,
    priority: "High",
    status: { not: "Done" },
  },
});
```

## 🔐 Important Notes

1. **Environment Variable:** Make sure `DATABASE_URL` is set in your `.env` file
2. **Cascade Delete:** When a User is deleted, all their Tasks are automatically deleted
3. **Indexes:** The `userId` field in Task has an index for faster queries
4. **Timestamps:** `createdAt` and `updatedAt` are managed automatically by Prisma

## 🚀 Next Steps

Now that the database is set up, you can:

1. Create authentication controllers using the User model
2. Create task CRUD controllers using the Task model
3. Add validation middleware for task priority and status values
4. Implement filtering and searching logic

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Database Queries Guide](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
