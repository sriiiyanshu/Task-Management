import { verifyToken } from "../config/jwt.js";
import prisma from "../config/database.js";

/**
 * Middleware to authenticate requests using JWT
 * Expects: Authorization: Bearer <token>
 * Sets req.user with the authenticated user's data
 */
export const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "No authorization header provided",
      });
    }

    // Check if it starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid authorization format. Use: Bearer <token>",
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        googleId: true,
        picture: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error("❌ JWT Authentication Error:", error.message);

    if (error.message === "Token has expired") {
      return res.status(401).json({
        success: false,
        error: "TokenExpired",
        message: "Your session has expired. Please login again.",
      });
    }

    if (error.message === "Invalid token") {
      return res.status(401).json({
        success: false,
        error: "InvalidToken",
        message: "Invalid authentication token",
      });
    }

    return res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Authentication failed",
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't block if token is missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log("Optional auth failed:", error.message);
  }

  next();
};
