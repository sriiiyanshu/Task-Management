import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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

        // Find user by googleId
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // If user doesn't exist, create new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              name,
              picture,
            },
          });
          console.log(`✅ New user created: ${email}`);
        } else {
          console.log(`✅ Existing user logged in: ${email}`);
        }

        // Pass user to the next middleware
        return done(null, user);
      } catch (error) {
        console.error("❌ Error in Google Strategy:", error);
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
