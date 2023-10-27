"use strict";

/** Shared config for application; can be required many places. */

// Load environment variables from a .env file
require("dotenv").config();
require("colors");

// Define a secret key for token generation or use a default value for development
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Define the port to listen on, or use a default value of 3001
const PORT = +process.env.PORT || 3001;

// Determine the database URI based on the current environment (test, production, or development)
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///jobly_test"
      : process.env.DATABASE_URL || "postgresql:///jobly";
}

// Set the bcrypt work factor to a lower value during tests to speed up password hashing
// For non-test use, use a work factor of 12
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Display the configuration settings
console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

// Export the configuration variables for use in the application
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};