# Account Linking Feature - Implementation Guide

## Overview

Users can now seamlessly use both Google OAuth and email/password authentication with the same email address. The system automatically links accounts when the same email is used across different authentication methods.

## Key Features

### 1. **Google OAuth → Email/Password Linking**

When a user who signed up with Google OAuth wants to use email/password authentication:

- They can go to the signup page and enter the same email
- The system will add a username and password to their existing OAuth account
- They can now login using either Google OAuth OR email/password

### 2. **Email/Password → Google OAuth Linking**

When a user who signed up with email/password wants to use Google OAuth:

- They can click "Sign in with Google" and authorize with the same email
- The system will link their Google account to the existing email/password account
- They can now login using either method

### 3. **Set Password for OAuth Users**

OAuth users who are already logged in can set a password:

- Use the `POST /auth/set-password` endpoint (requires authentication)
- Provide a username and password
- This enables them to login with email/password without going through signup

## Backend Implementation

### Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique           // Shared across both auth methods
  googleId  String?  @unique           // Optional - only for OAuth users
  username  String?  @unique           // Optional - only for password users
  password  String?                    // Optional - hashed password
  name      String
  picture   String?
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Updated Endpoints

#### 1. `POST /auth/signup` (Enhanced)

**Behavior:**

- If email exists with OAuth only (no password):
  - Adds username and password to the OAuth account
  - Returns success message: "Password added to your account successfully"
- If email exists with password:
  - Returns error: "Email already registered with password"
- If email doesn't exist:
  - Creates new user with email/password authentication

**Request:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (OAuth user adding password):**

```json
{
  "success": true,
  "message": "Password added to your account successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

#### 2. `GET /auth/google/callback` (Enhanced)

**Behavior:**

- Checks if googleId exists → Login existing OAuth user
- If not, checks if email exists → **Links Google account to existing user**
- If neither exists → Creates new OAuth user

**Account Linking Logic:**

```javascript
// 1. Try to find by googleId
let user = await prisma.user.findUnique({ where: { googleId } });

// 2. If not found, check email (linking)
if (!user) {
  user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Link Google account
    user = await prisma.user.update({
      where: { email },
      data: { googleId, picture },
    });
  }
}

// 3. If still not found, create new user
if (!user) {
  user = await prisma.user.create({
    data: { email, googleId, name, picture },
  });
}
```

#### 3. `POST /auth/login` (Enhanced Error Messages)

**Behavior:**

- If user has no password (OAuth-only):
  - Returns helpful error message directing them to either use Google Sign-In or set a password

**Error Response:**

```json
{
  "success": false,
  "errors": ["This account was created with Google Sign-In and has no password set. Please either sign in with Google or set a password by signing up with the same email."]
}
```

#### 4. `POST /auth/set-password` (New Endpoint)

**Purpose:** Allows authenticated OAuth users to set a password

**Auth Required:** Yes (JWT token)

**Request:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password set successfully. You can now login with email/username and password.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

**Validation:**

- Username: 3-20 characters, alphanumeric + underscore
- Password: Minimum 6 characters
- Checks if password already set
- Checks if username is taken

## User Flows

### Flow 1: OAuth User Wants Email/Password Access

**Scenario:** User signed up with Google, now wants to login with password

**Steps:**

1. User is already logged in via Google OAuth
2. Option A - Via Signup Page:
   - Go to signup page
   - Enter the same email they used for Google
   - Choose a username and password
   - Submit → Account is updated with username/password
3. Option B - Via Set Password API (if building a settings page):
   - Call `POST /auth/set-password` with JWT token
   - Provide username and password
   - Account is updated

**Result:** User can now login with either method

### Flow 2: Email/Password User Wants OAuth Access

**Scenario:** User signed up with email/password, now wants to use Google Sign-In

**Steps:**

1. User clicks "Sign in with Google"
2. Authorizes with the same email used for signup
3. Backend detects matching email
4. Google account is linked automatically

**Result:** User can now login with either method

### Flow 3: Login Error Handling

**Scenario:** OAuth user tries to login with password before setting one

**Steps:**

1. User enters email/username and password
2. Backend detects user has no password
3. Returns helpful error message
4. User can either:
   - Click "Sign in with Google" button
   - Or go to signup page to set password

## Testing Guide

### Test Case 1: OAuth → Email/Password Linking

```bash
# Step 1: Create OAuth user (use Google Sign-In in UI)
# User: john@example.com created via Google

# Step 2: Try to signup with same email
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "name": "John Doe"
  }'

# Expected: Success - password added to account

# Step 3: Login with password
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "johndoe",
    "password": "password123"
  }'

# Expected: Success - login works with password
```

### Test Case 2: Email/Password → OAuth Linking

```bash
# Step 1: Create email/password user
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "username": "janedoe",
    "password": "password123",
    "name": "Jane Doe"
  }'

# Step 2: Use Google Sign-In with same email (jane@example.com)
# Navigate to: http://localhost:3000/login
# Click "Sign in with Google"
# Authorize with jane@example.com

# Expected: Success - Google account linked, user logged in
```

### Test Case 3: Set Password for OAuth User

```bash
# Step 1: Get JWT token (from Google OAuth or previous login)
TOKEN="your_jwt_token_here"

# Step 2: Set password
curl -X POST http://localhost:8080/auth/set-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "johndoe",
    "password": "newpassword123"
  }'

# Expected: Success - password set
```

### Test Case 4: Login Error for OAuth-Only User

```bash
# Given: User exists with Google OAuth, no password set

curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "oauth-user@example.com",
    "password": "anypassword"
  }'

# Expected: 401 error with helpful message
# "This account was created with Google Sign-In and has no password set..."
```

## Security Considerations

### 1. **Email Verification**

- Currently, both OAuth and email signup don't require email verification
- Consider adding email verification for email/password signups
- Google OAuth provides verified emails by default

### 2. **Account Takeover Prevention**

- OAuth providers (Google) verify email ownership
- When linking via OAuth, the email is already verified by Google
- When adding password to OAuth account, user must provide username + password

### 3. **Password Security**

- Passwords are hashed with bcrypt (10 rounds)
- Minimum 6 characters required
- Consider adding password strength requirements

### 4. **Unique Constraints**

- Email: Must be unique across all users
- GoogleId: Must be unique (when present)
- Username: Must be unique (when present)

## Frontend Integration

### Handling Signup for OAuth Users

The signup form automatically handles OAuth users:

```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors([]);

  try {
    const response = await axios.post("http://localhost:8080/auth/signup", {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      name: formData.name,
    });

    if (response.data.success) {
      // Check if it's an account update or new account
      if (response.data.message.includes("Password added")) {
        // Show success message for account linking
        alert("Password added successfully! You can now login with email/password.");
      }

      setToken(response.data.token);
      router.push("/dashboard");
    }
  } catch (error) {
    setErrors(error.response?.data?.errors || ["Signup failed. Please try again."]);
  } finally {
    setLoading(false);
  }
};
```

### Displaying Login Errors

```javascript
// Error display in login page
{
  errors.length > 0 && (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      {errors.map((error, index) => (
        <p key={index} className="text-red-600 text-sm">
          {error}
        </p>
      ))}
    </div>
  );
}
```

## Future Enhancements

### 1. **Settings Page for Password Management**

Create a user settings page where OAuth users can:

- Set their password if not already set
- Change their existing password
- View which authentication methods are linked

### 2. **Account Unlinking**

Allow users to unlink authentication methods:

- Remove Google OAuth (if password is set)
- Remove password (if OAuth is linked)
- Prevent removing the last authentication method

### 3. **Multiple OAuth Providers**

Extend to support more OAuth providers:

- GitHub
- Microsoft
- Facebook
- Link multiple OAuth providers to one account

### 4. **Email Verification**

Add email verification for security:

- Send verification email on signup
- Verify email before allowing login
- Skip verification for OAuth emails (already verified)

## Database Queries for Debugging

```sql
-- Check all users and their auth methods
SELECT
  id,
  email,
  username,
  CASE WHEN googleId IS NOT NULL THEN 'Yes' ELSE 'No' END as has_google,
  CASE WHEN password IS NOT NULL THEN 'Yes' ELSE 'No' END as has_password,
  name
FROM "User";

-- Find users with both auth methods
SELECT email, username, name
FROM "User"
WHERE googleId IS NOT NULL AND password IS NOT NULL;

-- Find OAuth-only users
SELECT email, name
FROM "User"
WHERE googleId IS NOT NULL AND password IS NULL;

-- Find password-only users
SELECT email, username, name
FROM "User"
WHERE password IS NOT NULL AND googleId IS NULL;
```

## Summary

✅ **Implemented Features:**

- ✅ OAuth users can add password via signup page
- ✅ Password users can link Google account seamlessly
- ✅ Set password endpoint for authenticated OAuth users
- ✅ Helpful error messages guiding users
- ✅ Automatic account linking based on email
- ✅ Security maintained with proper validation

✅ **User Benefits:**

- Flexibility to use any authentication method
- No duplicate accounts for the same email
- Seamless switching between auth methods
- Better user experience with helpful error messages
