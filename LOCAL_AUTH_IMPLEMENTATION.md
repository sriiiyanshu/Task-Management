# Local Authentication Implementation

## Overview

Added traditional username/email + password authentication alongside existing Google OAuth.

## Backend Changes

### 1. Database Schema Updates (`server/prisma/schema.prisma`)

- Made `googleId` optional (nullable)
- Added `username` field (optional, unique)
- Added `password` field (optional, hashed)

### 2. Dependencies Added

```bash
npm install bcrypt passport-local
```

### 3. Passport Configuration (`server/src/config/passport.js`)

- Added `LocalStrategy` for username/email + password authentication
- Checks if user exists by email OR username
- Verifies bcrypt-hashed passwords
- Prevents OAuth users from logging in with password

### 4. Validation Middleware (`server/src/validators/auth.validator.js`)

**New file** with input validation:

- **Email**: Valid email format
- **Username**: 3-20 characters, alphanumeric + underscore
- **Password**: Minimum 6 characters
- **Name**: Required field

### 5. Auth Routes (`server/src/routes/auth.js`)

Added two new endpoints:

#### `POST /auth/signup`

- Validates input (email, username, password, name)
- Checks for existing users (email or username)
- Hashes password with bcrypt (10 rounds)
- Creates new user in database
- Returns JWT token

#### `POST /auth/login`

- Validates input (emailOrUsername, password)
- Uses Passport LocalStrategy
- Finds user by email OR username
- Verifies password
- Returns JWT token

### 6. Migration Applied

```sql
ALTER TABLE "User"
  ALTER COLUMN "googleId" DROP NOT NULL,
  ADD COLUMN "username" TEXT,
  ADD COLUMN "password" TEXT;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
```

## Frontend Changes

### Updated Login Page (`client/src/pages/login.js`)

#### New Features

1. **Toggle Between Login/Signup** - Two tabs for switching modes
2. **Login Form**:

   - Email or Username field (accepts both)
   - Password field
   - Submit button with loading state

3. **Signup Form**:

   - Full Name field
   - Email field
   - Username field (with validation hint)
   - Password field (with validation hint)
   - Submit button with loading state

4. **Error Handling** - Displays validation errors from backend
5. **Google OAuth** - Still available below a divider

#### API Integration

- Calls `POST /auth/signup` for new user registration
- Calls `POST /auth/login` for existing user authentication
- Stores JWT token in localStorage on success
- Redirects to dashboard after successful authentication

## Authentication Flow

### Local Signup

1. User fills signup form
2. Frontend validates and sends to `POST /auth/signup`
3. Backend validates input
4. Backend checks for existing email/username
5. Backend hashes password with bcrypt
6. Backend creates user in database
7. Backend returns JWT token
8. Frontend stores token and redirects to dashboard

### Local Login

1. User enters email/username and password
2. Frontend sends to `POST /auth/login`
3. Backend validates input
4. Passport LocalStrategy finds user
5. Bcrypt compares password with hash
6. Backend returns JWT token
7. Frontend stores token and redirects to dashboard

### Google OAuth (Unchanged)

1. User clicks "Sign in with Google"
2. Redirects to `/auth/google`
3. Google OAuth flow completes
4. Backend creates/finds user (no password)
5. Backend returns JWT token
6. Frontend stores token and redirects to dashboard

## Security Features

1. **Password Hashing** - bcrypt with 10 salt rounds
2. **Input Validation** - Server-side validation for all fields
3. **Unique Constraints** - Email and username must be unique
4. **JWT Tokens** - Secure authentication tokens
5. **OAuth Separation** - OAuth users can't login with password
6. **SQL Injection Protection** - Prisma ORM parameterized queries

## Testing the Implementation

### Test Signup

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "password123"
  }'
```

## Frontend Usage

1. Navigate to `http://localhost:3000/login`
2. Click "Sign Up" tab
3. Fill in all fields and submit
4. Or click "Login" tab to login with existing credentials
5. Or use "Sign in with Google" for OAuth

## Migration Instructions

If you need to run the migration manually:

```bash
cd server
npx prisma migrate deploy
npx prisma generate
npm run dev
```

## Environment Variables (No Changes Required)

Existing environment variables still work:

- `JWT_SECRET` - Used for both OAuth and local auth
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `DATABASE_URL` - PostgreSQL connection string

## Notes

- Users created via Google OAuth cannot login with password (no password stored)
- Users created via local signup cannot use "Sign in with Google" unless they connect their Google account later (future feature)
- Email field is shared between OAuth and local auth (unique constraint)
- Username is only for local auth users
