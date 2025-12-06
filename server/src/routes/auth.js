import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../config/jwt.js";

const router = express.Router();

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
