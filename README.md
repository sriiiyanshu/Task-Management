# Task Tracker 📝

> **A modern, full-stack task management application to help you stay organized and productive**

<div align="center">

### 🚀 [Live Demo](https://task-management-amber-alpha.vercel.app/login)

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-purple?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

</div>

---

## 👋 Welcome!

Task Tracker is a feature-rich task management application that helps you organize your work efficiently. Built with modern web technologies, it offers a seamless experience for managing tasks with flexible authentication options and real-time updates.

---

## 💡 About This Project

This full-stack application was developed as part of a **hiring assignment** to demonstrate proficiency in modern web development practices. The project showcases:

- **Full-Stack Development**: Separate client (Next.js) and server (Express) architecture with RESTful API communication
- **Modern Tech Stack**: Latest versions of Next.js 16, React 19, Express, PostgreSQL, and Prisma ORM
- **Authentication Mastery**: Dual authentication system with Google OAuth 2.0 and traditional email/password login
- **Cloud Deployment**: Production-ready deployment on Vercel (frontend) and Google App Engine (backend)
- **AI-Assisted Development**: Transparent use of AI tools for faster development and learning

### 🎯 Key Highlights

- ✨ **30+ comprehensive test cases** ensuring code quality and reliability
- 🔐 **Innovative account linking** that seamlessly connects OAuth and email accounts
- 📱 **Responsive design** that works beautifully on all devices
- 🚀 **Production-ready** with proper security, error handling, and CORS configuration

---

## 📋 Table of Contents

- [About This Project](#-about-this-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [AI Usage Statement](#-ai-usage-statement)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## ✨ Features

### Task Management

- ✅ Create, read, update, and delete tasks
- ✅ Task priority levels (Low, Medium, High)
- ✅ Task status tracking (To Do, In Progress, Done)
- ✅ Due date management with calendar picker
- ✅ Search tasks by title/description
- ✅ Filter tasks by status and priority
- ✅ Sort tasks by creation date
- ✅ Quick status updates from task cards
- ✅ Modal-based CRUD operations

### Authentication & Security

- ✅ Google OAuth 2.0 authentication
- ✅ Email/password authentication (username or email)
- ✅ **Seamless account linking** - Use both auth methods with same email
- ✅ JWT-based session management
- ✅ Bcrypt password hashing
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS attack prevention

### User Experience

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with Tailwind CSS
- ✅ Real-time form validation
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Intuitive dashboard layout
- ✅ Date restrictions (1 month maximum past dates)

---

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 16.0.7](https://nextjs.org/) (Pages Router)
- **UI Library**: [React 19.2.0](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **HTTP Client**: [Axios 1.13.2](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend

- **Runtime**: [Node.js 20+](https://nodejs.org/)
- **Framework**: [Express 4.18.2](https://expressjs.com/)
- **ORM**: [Prisma 5.7.1](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **Authentication**:
  - [Passport.js](http://www.passportjs.org/) (Google OAuth, Local Strategy)
  - [JWT](https://jwt.io/) (jsonwebtoken)
  - [bcrypt](https://www.npmjs.com/package/bcrypt) (password hashing)

### Development & Testing

- **Testing**: [Jest 30.2.0](https://jestjs.io/) + [Supertest 7.1.4](https://github.com/ladjs/supertest)
- **API Testing**: Comprehensive test suite (30+ tests)
- **Code Quality**: ESLint
- **Version Control**: Git + GitHub

### Deployment

- **Frontend Hosting**: [Vercel](https://vercel.com/)
- **Backend Hosting**: [Google App Engine](https://cloud.google.com/appengine)
- **Database Hosting**: [Neon](https://neon.tech/) (Serverless PostgreSQL)

---

## 🤖 AI Usage Statement

**This project was built with AI assistance as part of a hiring assignment requirement.**

### AI Tools Used

- **GitHub Copilot**: Code completion, debugging assistance, and implementation suggestions
- **Google Gemini**: Architecture planning, documentation generation, and problem-solving

### AI Contribution Details

#### Code Generation (~60%)

- Initial project scaffolding and boilerplate code
- API route implementations with Prisma queries
- React component structures and UI layouts
- Authentication middleware and JWT utilities
- Test suite generation with comprehensive coverage

#### Architecture & Design (~30%)

- Database schema design recommendations
- Authentication flow planning (OAuth + local auth)
- Account linking strategy implementation
- Security best practices implementation
- RESTful API design patterns

#### Documentation (~70%)

- README and deployment guides
- API documentation
- Code comments and inline documentation
- Testing documentation
- Environment variable documentation

#### Debugging & Optimization (~40%)

- Connection pool timeout fixes
- CORS configuration
- Account linking bug fixes
- Test suite debugging
- Performance optimization suggestions

### Human Contribution

#### Core Logic & Business Requirements (~50%)

- Feature specifications and requirements
- User flow decisions
- UI/UX design choices
- Priority and status definitions
- Date restriction logic

#### Testing & Validation (~40%)

- Manual testing of all features
- Edge case identification
- Security vulnerability testing
- User acceptance testing
- Production deployment validation

#### Integration & Customization (~70%)

- Environment configuration
- Google OAuth setup and credentials
- Database connection configuration
- Deployment configuration
- Custom styling and branding

### Learning Outcomes

Through AI-assisted development, I learned:

- Full-stack application architecture with separated concerns
- OAuth 2.0 implementation and account linking strategies
- JWT-based authentication patterns
- Prisma ORM advanced queries and migrations
- React hooks and state management
- Next.js Pages Router patterns
- Comprehensive testing strategies
- Deployment to cloud platforms (Vercel, Google App Engine)

**Skills demonstrated despite AI usage:**

- Ability to translate requirements into working code
- Understanding of full-stack architecture
- Debugging and problem-solving capabilities
- Integration of multiple technologies
- Security and best practices awareness
- Documentation and communication skills

---

## 🏗 Architecture

### System Overview

```
┌─────────────────┐
│   Next.js       │
│   Frontend      │
│   (Vercel)      │
└────────┬────────┘
         │ HTTPS/REST
         │
┌────────▼────────┐
│   Express       │
│   Backend       │
│   (App Engine)  │
└────────┬────────┘
         │ Prisma
         │
┌────────▼────────┐
│  PostgreSQL     │
│  Database       │
│  (Neon)         │
└─────────────────┘
```

### Authentication Flow

```
User → Frontend → Backend → Google OAuth / Local Auth
                    ↓
                  JWT Token
                    ↓
              Store in localStorage
                    ↓
          Include in API requests
```

### Account Linking

- **Email → OAuth**: User signs up with email, later uses Google OAuth with same email → Accounts automatically linked
- **OAuth → Email**: User signs up with Google, later sets username/password → Password added to OAuth account

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **PostgreSQL**: Not needed locally (using Neon cloud database)

### Required Accounts

1. **Google Cloud Console** - For OAuth credentials
2. **Neon** - For PostgreSQL database (free tier)
3. **(Optional) Vercel** - For frontend deployment
4. **(Optional) Google Cloud Platform** - For backend deployment

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-management.git
cd task-management
```

### 2. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env  # or use your preferred editor
```

**Required `.env` variables:**

```env
PORT=8080
NODE_ENV=development
DATABASE_URL="your-neon-postgresql-url"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
GOOGLE_CALLBACK_URL="http://localhost:8080/auth/google/callback"
CLIENT_URL="http://localhost:3000"
```

**Get Google OAuth Credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:8080/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

**Setup Database:**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 3. Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

**Required `.env.local` variables:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

| Variable               | Description                  | Example                                      |
| ---------------------- | ---------------------------- | -------------------------------------------- |
| `PORT`                 | Server port                  | `8080`                                       |
| `NODE_ENV`             | Environment                  | `development` or `production`                |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://user:pass@host/db`             |
| `JWT_SECRET`           | Secret for JWT signing       | `your-secret-key`                            |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID       | `123456.apps.googleusercontent.com`          |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret          | `GOCSPX-xxxxx`                               |
| `GOOGLE_CALLBACK_URL`  | OAuth redirect URI           | `http://localhost:8080/auth/google/callback` |
| `CLIENT_URL`           | Frontend URL for CORS        | `http://localhost:3000`                      |

### Frontend (`client/.env.local`)

| Variable              | Description     | Example                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |

**Note**: Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser.

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:8080`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:3000`

### Access the Application

1. Open browser: `http://localhost:3000`
2. Click "Sign in with Google" or use "Sign Up" tab
3. Create/manage tasks in the dashboard

### Production Build

**Backend:**

```bash
cd server
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm start
```

---

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**

- ✅ 30+ comprehensive tests
- ✅ Authentication middleware tests
- ✅ CRUD operation tests
- ✅ SQL injection prevention tests
- ✅ XSS attack prevention tests
- ✅ Authorization tests
- ✅ Edge case handling

**Test Results:**

```
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
Time:        ~0.5s
```

### Manual Testing Checklist

- [ ] Sign up with email/password
- [ ] Login with email/password
- [ ] Sign in with Google OAuth
- [ ] Create task
- [ ] Update task
- [ ] Delete task
- [ ] Filter tasks by status
- [ ] Filter tasks by priority
- [ ] Search tasks
- [ ] Quick status update
- [ ] Account linking (email → OAuth)
- [ ] Account linking (OAuth → email)

---

## 🌐 Deployment

### Quick Deployment Guide

1. **Deploy Backend to Google App Engine**

   - Update `server/app.yaml` with production values
   - Run `gcloud app deploy`

2. **Deploy Frontend to Vercel**
   - Connect GitHub repository
   - Set `NEXT_PUBLIC_API_URL` environment variable
   - Deploy

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/signup`

Create new user with email/password or add password to OAuth account.

**Request:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

#### POST `/auth/login`

Login with email/username and password.

**Request:**

```json
{
  "emailOrUsername": "johndoe",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### GET `/auth/google`

Initiate Google OAuth flow (redirects to Google).

#### GET `/auth/google/callback`

Google OAuth callback (redirects to frontend with token).

#### POST `/auth/set-password` (Protected)

Set password for OAuth users.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request:**

```json
{
  "username": "johndoe",
  "password": "newpassword123"
}
```

### Task Endpoints (All Protected)

#### GET `/api/tasks`

Get all tasks for authenticated user.

**Query Parameters:**

- `status` - Filter by status (To Do, In Progress, Done)
- `priority` - Filter by priority (Low, Medium, High)
- `search` - Search by title/description

**Response:**

```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2025-12-31T00:00:00.000Z",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-07T15:30:00.000Z"
  }
]
```

#### POST `/api/tasks`

Create new task.

**Request:**

```json
{
  "title": "New task",
  "description": "Task description",
  "status": "To Do",
  "priority": "Medium",
  "dueDate": "2025-12-31"
}
```

#### PUT `/api/tasks/:id`

Update existing task.

#### DELETE `/api/tasks/:id`

Delete task.

---

## 📁 Project Structure

```
task-management/
├── client/                      # Next.js Frontend
│   ├── src/
│   │   ├── pages/              # Next.js pages
│   │   │   ├── _app.js
│   │   │   ├── index.js        # Landing page
│   │   │   ├── login.js        # Auth page
│   │   │   ├── dashboard.js    # Main app
│   │   │   └── api/            # API routes (unused)
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Utilities (auth, API client)
│   │   └── styles/             # Global styles
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vercel.json             # Vercel config
│   └── .env.example
│
├── server/                      # Express Backend
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── config/             # Configuration
│   │   │   ├── database.js     # Prisma client
│   │   │   ├── passport.js     # Auth strategies
│   │   │   └── jwt.js          # JWT utilities
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js         # Auth endpoints
│   │   │   └── tasks.js        # Task CRUD
│   │   ├── middleware/         # Express middleware
│   │   │   └── auth.js         # JWT verification
│   │   └── validators/         # Input validation
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Migration history
│   ├── tests/
│   │   └── app.test.js         # Test suite
│   ├── package.json
│   ├── app.yaml                # Google App Engine config
│   ├── .gcloudignore
│   └── .env.example
│
├── README.md                    # This file
└── .gitignore
```


---

## 📄 License

This project is created for **educational and demonstration purposes** as part of a hiring assignment. Feel free to use the code for learning, but please credit appropriately if you use substantial portions.

---

- 🚀 [Live Application](https://task-management-amber-alpha.vercel.app/login)


_Last Updated: 7 December 2025_

</div>
