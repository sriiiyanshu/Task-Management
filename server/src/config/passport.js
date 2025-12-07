import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "./database.js";

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user info from Google profile
        const { id: googleId, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const name = displayName;
        const picture = photos?.[0]?.value || null;

        // First, try to find user by googleId
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // If found by googleId, return the user
        if (user) {
          console.log(`✅ Existing OAuth user logged in: ${email}`);
          return done(null, user);
        }

        // If not found by googleId, check if email exists (account linking)
        user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // Link Google account to existing email-based account
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId,
              picture: picture || user.picture, // Update picture if available
            },
          });
          console.log(`✅ Linked Google account to existing user: ${email}`);
          return done(null, user);
        }

        // No existing user found, create new user
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            name,
            picture,
          },
        });
        console.log(`✅ New OAuth user created: ${email}`);

        // Pass user to the next middleware
        return done(null, user);
      } catch (error) {
        console.error("❌ Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Configure Local Strategy for username/email + password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "emailOrUsername", // Accept either email or username
      passwordField: "password",
    },
    async (emailOrUsername, password, done) => {
      try {
        // Find user by email or username
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
          },
        });

        // Check if user exists
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Check if user has a password (not OAuth-only user)
        if (!user.password) {
          return done(null, false, {
            message: "This account was created with Google Sign-In and has no password set. Please either sign in with Google or set a password by signing up with the same email.",
          });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        console.log(`✅ Local user logged in: ${user.email}`);
        return done(null, user);
      } catch (error) {
        console.error("❌ Error in Local Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for the session (not used with JWT, but required by Passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session (not used with JWT, but required by Passport)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
