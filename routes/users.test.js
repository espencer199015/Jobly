"use strict";

const request = require("supertest");
const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

// Setting up common actions before and after all tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

// Testing user creation with various scenarios
describe("POST /users", function () {
  test("works for users: create non-admin", async function () {
    // Create a new non-admin user and check the response
  });

  test("works for users: create admin", async function () {
    // Create a new admin user and check the response
  });

  test("unauth for anon", async function () {
    // Test that anonymous users can't create users
  });

  test("bad request if missing data", async function () {
    // Test that a bad request is returned if user data is missing
  });

  test("bad request if invalid data", async function () {
    // Test that a bad request is returned for invalid user data
  });
});

/************************************** GET /users */

// Testing user retrieval
describe("GET /users", function () {
  test("works for users", async function () {
    // Retrieve a list of users and check the response
  });

  test("unauth for anon", async function () {
    // Test that anonymous users can't access the user list
  });

  test("fails: test next() handler", async function () {
    // Test an error scenario to ensure the error-handler works
  });
});

/************************************** GET /users/:username */

// Testing user retrieval by username
describe("GET /users/:username", function () {
  test("works for users", async function () {
    // Retrieve user details by username and check the response
  });

  test("unauth for anon", async function () {
    // Test that anonymous users can't access user details
  });

  test("not found if user not found", async function () {
    // Test that a not found response is returned if the user is not found
  });
});

/************************************** PATCH /users/:username */

// Testing user data update
describe("PATCH /users/:username", () => {
  test("works for users", async function () {
    // Update user data and check the response
  });

  test("unauth for anon", async function () {
    // Test that anonymous users can't update user data
  });

  test("not found if no such user", async function () {
    // Test that a not found response is returned if the user doesn't exist
  });

  test("bad request if invalid data", async function () {
    // Test that a bad request is returned for invalid data
  });

  test("works: set new password", async function () {
    // Set a new password for the user and check the response
  });
});

/************************************** DELETE /users/:username */

// Testing user deletion
describe("DELETE /users/:username", function () {
  test("works for users", async function () {
    // Delete a user and check the response
  });

  test("unauth for anon", async function () {
    // Test that anonymous users can't delete users
  });

  test("not found if user missing", async function () {
    // Test that a not found response is returned if the user is missing
  });
});