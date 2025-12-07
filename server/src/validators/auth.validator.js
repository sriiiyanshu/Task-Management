/**
 * Validation middleware for authentication routes
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation: 3-20 chars, alphanumeric + underscore
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// Password validation: min 6 chars
const PASSWORD_MIN_LENGTH = 6;

/**
 * Validate signup request
 */
export const validateSignup = (req, res, next) => {
  const { email, username, password, name } = req.body;
  const errors = [];

  // Validate email
  if (!email) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push("Invalid email format");
  }

  // Validate username
  if (!username) {
    errors.push("Username is required");
  } else if (!USERNAME_REGEX.test(username)) {
    errors.push("Username must be 3-20 characters long and contain only letters, numbers, and underscores");
  }

  // Validate password
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }

  // Validate name
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

/**
 * Validate login request
 */
export const validateLogin = (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  const errors = [];

  // Validate emailOrUsername
  if (!emailOrUsername) {
    errors.push("Email or username is required");
  }

  // Validate password
  if (!password) {
    errors.push("Password is required");
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
