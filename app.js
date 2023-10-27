"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Enable request logging using Morgan middleware
app.use(morgan("tiny"));

// Authenticate JSON Web Tokens (JWT) for user authorization
app.use(authenticateJWT);

// Mount various route handlers for different parts of the application
app.use("/auth", authRoutes);         // Authentication routes
app.use("/companies", companiesRoutes); // Company-related routes
app.use("/users", usersRoutes);         // User-related routes

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;