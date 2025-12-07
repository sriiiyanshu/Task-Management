# Account Linking - Quick Test Scenarios

## ✅ Test Scenario 1: Email/Password First, Then Google OAuth

### Step-by-Step:

1. **Create Account with Email/Password**

   - Go to: `http://localhost:3000/login`
   - Click "Sign Up" tab
   - Enter:
     - Name: "John Doe"
     - Email: "john@gmail.com"
     - Username: "johndoe"
     - Password: "password123"
   - Click "Sign Up"
   - ✅ Should redirect to dashboard

2. **Logout**

   - Logout from the application

3. **Login with Google OAuth (Same Email)**

   - Go to: `http://localhost:3000/login`
   - Click "Sign in with Google"
   - Select/Use account with email: "john@gmail.com"
   - ✅ Should login successfully
   - ✅ Accounts are now linked!

4. **Verify Both Methods Work**
   - Logout
   - Try logging in with username "johndoe" + password "password123"
   - ✅ Should work
   - Logout again
   - Try "Sign in with Google" again
   - ✅ Should also work

---

## ✅ Test Scenario 2: Google OAuth First, Then Email/Password

### Step-by-Step:

1. **Create Account with Google OAuth**

   - Go to: `http://localhost:3000/login`
   - Click "Sign in with Google"
   - Select/Use a Google account (e.g., "jane@gmail.com")
   - ✅ Should redirect to dashboard
   - Note: At this point, account has NO password or username

2. **Try to Login with Password (Should Fail Helpfully)**

   - Logout
   - Go to: `http://localhost:3000/login`
   - Click "Login" tab
   - Enter:
     - Email/Username: "jane@gmail.com"
     - Password: "anypassword"
   - Click "Login"
   - ✅ Should show error: "This account was created with Google Sign-In and has no password set. Please either sign in with Google or set a password by signing up with the same email."

3. **Add Password via Signup**

   - Click "Sign Up" tab
   - Enter:
     - Name: "Jane Doe" (or keep existing)
     - Email: "jane@gmail.com" (SAME as Google account)
     - Username: "janedoe" (new username)
     - Password: "password123" (new password)
   - Click "Sign Up"
   - ✅ Should show success: "Password added to your account successfully"
   - ✅ Should redirect to dashboard

4. **Verify Both Methods Work**
   - Logout
   - Try logging in with username "janedoe" + password "password123"
   - ✅ Should work
   - Logout again
   - Try "Sign in with Google" with "jane@gmail.com"
   - ✅ Should also work

---

## ✅ Test Scenario 3: Set Password API (For OAuth Users)

### Prerequisites:

- User logged in via Google OAuth (has JWT token)
- User has NO password set yet

### Step-by-Step:

1. **Get JWT Token**

   - Login with Google OAuth
   - Open browser DevTools → Application → Local Storage
   - Copy the value of `token` or `authToken`

2. **Call Set Password API**

   ```bash
   curl -X POST http://localhost:8080/auth/set-password \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
     -d '{
       "username": "newusername",
       "password": "newpassword123"
     }'
   ```

3. **Expected Response**

   ```json
   {
     "success": true,
     "message": "Password set successfully. You can now login with email/username and password.",
     "user": {
       "id": 1,
       "email": "user@gmail.com",
       "username": "newusername",
       "name": "User Name"
     }
   }
   ```

4. **Test New Login**
   - Logout
   - Login with username "newusername" + password "newpassword123"
   - ✅ Should work

---

## 🔍 Verification Checklist

### After Each Test, Verify:

- [ ] User can login with email/password
- [ ] User can login with Google OAuth
- [ ] Both methods access the SAME account (same tasks, same data)
- [ ] No duplicate accounts created
- [ ] Proper error messages shown when needed

### Database Check (Optional):

```bash
# Connect to your database and run:
SELECT
  id,
  email,
  username,
  CASE WHEN "googleId" IS NOT NULL THEN 'Yes' ELSE 'No' END as has_google,
  CASE WHEN password IS NOT NULL THEN 'Yes' ELSE 'No' END as has_password,
  name
FROM "User";
```

You should see:

- Single row per email
- Both `has_google` and `has_password` = 'Yes' for linked accounts

---

## 🚨 Error Cases to Test

### 1. **Username Already Taken**

- Create user with username "testuser"
- Try to signup OAuth user with same username "testuser"
- ✅ Should show: "Username already taken"

### 2. **Email Already Has Password**

- Create email/password account
- Try to signup again with same email
- ✅ Should show: "Email already registered with password"

### 3. **Invalid Username Format**

- Try username with special characters: "test@user!"
- ✅ Should show: "Username must be 3-20 characters long and contain only letters, numbers, and underscores"

### 4. **Short Password**

- Try password: "pass"
- ✅ Should show: "Password must be at least 6 characters long"

---

## 📝 Expected Console Logs (Backend)

### When Linking OAuth to Existing Email Account:

```
✅ Linked Google account to existing user: john@gmail.com
```

### When Adding Password to OAuth Account:

```
✅ OAuth user added password: jane@gmail.com
```

### When Setting Password via API:

```
✅ Password set for OAuth user: user@gmail.com
```

---

## 🎯 Success Criteria

All tests should pass with:
✅ No duplicate accounts created
✅ Seamless switching between auth methods
✅ Helpful error messages
✅ Proper account linking
✅ Data persisted across both auth methods
✅ Security maintained (passwords hashed, JWT tokens valid)
