import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { validateSignup, validateLogin, validateSetPassword } from "../validators/auth.validator.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user with email/username and password
 * @access  Public
 */
router.post("/signup", validateSignup, async (req, res) => {
  try {
    const { email, username, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      // If email exists and user registered via OAuth (no password set)
      if (existingUser.email === email) {
        if (!existingUser.password && existingUser.googleId) {
          // OAuth user trying to add password - update the account
          const hashedPassword = await bcrypt.hash(password, 10);

          const updatedUser = await prisma.user.update({
            where: { email },
            data: {
              username,
              password: hashedPassword,
            },
          });

          const token = generateToken(updatedUser);

          console.log(`✅ OAuth user added password: ${updatedUser.email}`);

          return res.status(200).json({
            success: true,
            message: "Password added to your account successfully",
            token,
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              username: updatedUser.username,
              name: updatedUser.name,
            },
          });
        }

        // Email already has password
        return res.status(400).json({
          success: false,
          errors: ["Email already registered with password"],
        });
      }

      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          errors: ["Username already taken"],
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT token
    const token = generateToken(user);

    console.log(`✅ New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    res.status(500).json({
      success: false,
      errors: ["Registration failed. Please try again."],
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login with email/username and password
 * @access  Public
 */
router.post("/login", validateLogin, (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.error("❌ Error in login:", err);
      return res.status(500).json({
        success: false,
        errors: ["Login failed. Please try again."],
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [info?.message || "Invalid credentials"],
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  })(req, res, next);
});

/**
 * @route   GET /auth/google
 * @desc    Initiate Google OAuth authentication
 * @access  Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // We're using JWT, not sessions
  })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback - generates JWT and redirects to frontend
 * @access  Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateToken(req.user);

      // Redirect to frontend with token in query parameter
      const redirectUrl = `${process.env.CLIENT_URL}/auth/success?token=${token}`;

      console.log(`🔐 User authenticated: ${req.user.email}`);
      console.log(`🔀 Redirecting to: ${redirectUrl}`);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("❌ Error generating token:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
    }
  }
);

/**
 * @route   GET /auth/logout
 * @desc    Logout user (client-side should remove token)
 * @access  Public
 */
router.get("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully. Please remove the token from client storage.",
  });
});

/**
 * @route   POST /auth/set-password
 * @desc    Set password for OAuth users (requires authentication)
 * @access  Private
 */
router.post("/set-password", authenticateJWT, validateSetPassword, async (req, res) => {
  try {
    const { username, password } = req.body;
    const userId = req.user.id;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    // Check if user already has a password
    if (user.password) {
      return res.status(400).json({
        success: false,
        errors: ["Password is already set for this account. Use password change instead."],
      });
    }

    // Check if username is already taken by another user
    if (username !== user.username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          errors: ["Username already taken"],
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password and username
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log(`✅ Password set for OAuth user: ${updatedUser.email}`);

    res.json({
      success: true,
      message: "Password set successfully. You can now login with email/username and password.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error("❌ Error setting password:", error);
    res.status(500).json({
      success: false,
      errors: ["Failed to set password. Please try again."],
    });
  }
});

/**
 * @route   GET /auth/me
 * @desc    Get current user info (requires authentication)
 * @access  Private
 */
router.get("/me", (req, res) => {
  // This route will be protected by auth middleware
  // The middleware will be added in the next step
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
