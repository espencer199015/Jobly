"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
} = require("./auth");

const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");

// Test suite for 'authenticateJWT' middleware
describe("authenticateJWT", function () {

  // Test case: JWT is passed via header and is valid
  test("works: via header", function () {
    expect.assertions(2);
    // Simulate a request with a valid JWT token in the header
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    // Invoke the 'authenticateJWT' middleware
    authenticateJWT(req, res, next);
    // Ensure that 'res.locals' contains the user payload from the token
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  // Test case: No JWT token provided in the request header
  test("works: no header", function () {
    expect.assertions(2);
    // Simulate a request without an authorization header
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    // Invoke the 'authenticateJWT' middleware
    authenticateJWT(req, res, next);
    // Ensure that 'res.locals' remains empty
    expect(res.locals).toEqual({});
  });

  // Test case: Invalid JWT token provided in the request header
  test("works: invalid token", function () {
    expect.assertions(2);
    // Simulate a request with an invalid JWT token in the header
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    // Invoke the 'authenticateJWT' middleware
    authenticateJWT(req, res, next);
    // Ensure that 'res.locals' remains empty
    expect(res.locals).toEqual({});
  });
});

// Test suite for 'ensureLoggedIn' middleware
describe("ensureLoggedIn", function () {

  // Test case: User is logged in (has a 'user' object in 'res.locals')
  test("works", function () {
    expect.assertions(1);
    // Simulate a request with a logged-in user in 'res.locals'
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    // Invoke the 'ensureLoggedIn' middleware
    ensureLoggedIn(req, res, next);
  });

  // Test case: User is not logged in (no 'user' object in 'res.locals')
  test("unauth if no login", function () {
    expect.assertions(1);
    // Simulate a request without a 'user' object in 'res.locals'
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      // Ensure that an UnauthorizedError is raised
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    // Invoke the 'ensureLoggedIn' middleware
    ensureLoggedIn(req, res, next);
  });
});