# Task Tracker Server

Backend API for the Task Tracker application built with Express, Prisma, and Google OAuth.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon.tech recommended)
- Google OAuth credentials

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values:

   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your frontend URL (default: http://localhost:3000)

3. **Run the server:**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

Server will start on `http://localhost:8080` (or the PORT you specified in .env)

## 📁 Project Structure

```
server/
├── src/
│   ├── server.js           # Main Express application
│   ├── config/             # Configuration files (Prisma, Passport, JWT)
│   ├── routes/             # API route definitions
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware (auth, error handling)
│   └── validators/         # Request validation
├── prisma/
│   └── schema.prisma       # Database schema
├── package.json
├── app.yaml               # Google App Engine config
└── .env.example           # Environment template
```

## 🔧 Available Scripts

- `npm run dev` - Start server in development mode with auto-restart
- `npm start` - Start server in production mode
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 🌐 API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication (Coming Soon)

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/logout` - Logout user

### Tasks (Coming Soon)

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔐 Environment Variables

| Variable               | Description                  | Example                          |
| ---------------------- | ---------------------------- | -------------------------------- |
| `PORT`                 | Server port                  | `8080`                           |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://...`               |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID       | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret   | `GOCSPX-xxx`                     |
| `JWT_SECRET`           | Secret for JWT signing       | `your-secret-key`                |
| `CLIENT_URL`           | Frontend URL for CORS        | `http://localhost:3000`          |

## 🚢 Deployment (Google App Engine)

1. **Update `app.yaml`** with production environment variables

2. **Deploy:**
   ```bash
   gcloud app deploy
   ```

## 📝 Next Steps

1. Set up Prisma schema and run migrations
2. Implement authentication routes with Passport.js
3. Create task CRUD endpoints
4. Add input validation middleware
5. Set up error handling

## 🛠️ Technology Stack

- **Express** - Web framework
- **Prisma** - ORM for PostgreSQL
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing

## 📄 License

ISC
