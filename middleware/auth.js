"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// Middleware: Authenticate user with JWT token.
// If a token is provided in the request's headers, verify it, and if valid, store the token payload
// (including username and isAdmin) on 'res.locals'.
// It's not an error if no token is provided or if the token is not valid.
function authenticateJWT(req, res, next) {
  try {
    // Check if there is an 'Authorization' header in the request
    const authHeader = req.headers && req.headers.authorization;

    if (authHeader) {
      // Extract the token from the header and remove the "Bearer " prefix
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      // Verify the token and store the payload in 'res.locals.user'
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }

    // Continue to the next middleware or route
    return next();
  } catch (err) {
    // If there's an error, continue to the next middleware or route
    return next();
  }
}

// Middleware to use when a user must be logged in.
// If not logged in, it raises an 'UnauthorizedError'.
function ensureLoggedIn(req, res, next) {
  try {
    // Check if 'res.locals.user' exists (user is logged in)
    if (!res.locals.user) throw new UnauthorizedError();
    // Continue to the next middleware or route
    return next();
  } catch (err) {
    // If there's an error (user is not logged in), pass it to the next middleware or route
    return next(err);
  }
}

// Export the middleware functions for use in other modules
module.exports = {
  authenticateJWT,
  ensureLoggedIn,
};