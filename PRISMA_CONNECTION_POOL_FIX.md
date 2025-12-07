# Prisma Connection Pool Timeout Fix

## Problem

```
Timed out fetching a new connection from the connection pool.
(Current connection pool timeout: 10, connection limit: 17)
```

## Root Cause

- Too many database connections being opened without being properly closed
- Connection pool exhaustion due to concurrent requests
- Neon's free tier has connection limits

## Solution

### 1. Update Your DATABASE_URL (IMPORTANT!)

Open `server/.env` and update your `DATABASE_URL` to include connection pool parameters:

```bash
# OLD (without parameters)
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"

# NEW (with connection pool parameters)
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require&connection_limit=5&pool_timeout=10"
```

**Parameters explained:**

- `connection_limit=5` - Limit to 5 connections (safe for Neon free tier)
- `pool_timeout=10` - Wait 10 seconds before timing out

### 2. Restart Your Server

After updating the DATABASE_URL:

```bash
cd server
# Kill the running server (Ctrl+C)
npm run dev
```

### 3. Alternative: Use Prisma Accelerate (Recommended for Production)

For better connection pooling, consider using Prisma Accelerate:
https://www.prisma.io/data-platform/accelerate

## Prevention Tips

### ✅ Do's:

1. Always use the singleton Prisma client pattern (already implemented)
2. Set appropriate connection limits in DATABASE_URL
3. Add graceful shutdown handlers (already implemented)
4. Use connection pooling for production

### ❌ Don'ts:

1. Don't create multiple PrismaClient instances
2. Don't forget to restart server after .env changes
3. Don't use unlimited connections on free tier databases

## Neon-Specific Limits

Neon Free Tier:

- **Max connections**: 17 (shared across all apps)
- **Recommended limit**: 5 per application
- **Concurrent queries**: Limited

If you're hitting limits frequently:

1. Upgrade to Neon Pro (100+ connections)
2. Use Prisma Accelerate for connection pooling
3. Implement caching to reduce database queries

## Quick Fix Summary

```bash
# 1. Stop your server (Ctrl+C in the terminal running npm run dev)

# 2. Edit server/.env and add these parameters to DATABASE_URL:
&connection_limit=5&pool_timeout=10

# 3. Restart server
cd server && npm run dev

# 4. Test by creating a few tasks - error should be gone!
```

## Still Having Issues?

If the error persists:

1. **Check if you have multiple servers running:**

   ```bash
   lsof -ti:8080
   # If you see multiple PIDs, kill them:
   lsof -ti:8080 | xargs kill -9
   ```

2. **Clear Prisma generated client:**

   ```bash
   cd server
   rm -rf node_modules/.prisma
   npx prisma generate
   npm run dev
   ```

3. **Check Neon dashboard:**
   - Go to https://console.neon.tech
   - Check if you're near connection limits
   - Consider upgrading plan if needed

## Root Cause of Your Error

The error occurred because:

1. Each API request opens a database connection
2. Creating multiple tasks quickly opened multiple connections
3. Connection pool ran out of available connections
4. Neon has a limit of 17 connections on free tier
5. Without `connection_limit` parameter, Prisma tries to use more

**This is NOT related to duplicate due dates** - it's purely a connection management issue.
