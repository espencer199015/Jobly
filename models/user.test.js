"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    // Test that user authentication works with valid credentials.
  });

  test("unauth if no such user", async function () {
    // Test that user authentication fails if there is no such user.
  });

  test("unauth if wrong password", async function () {
    // Test that user authentication fails with an incorrect password.
  });
});

/************************************** register */

describe("register", function () {
  test("works", async function () {
    // Test that user registration works with valid data.
  });

  test("works: adds admin", async function () {
    // Test that user registration works with admin privileges.
  });

  test("bad request with dup data", async function () {
    // Test that user registration fails with duplicate data.
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    // Test that retrieving all users works as expected.
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    // Test that retrieving a user by username works.
  });

  test("not found if no such user", async function () {
    // Test that attempting to retrieve a non-existent user results in a NotFoundError.
  });
});

/************************************** update */

describe("update", function () {
  test("works", async function () {
    // Test that updating user data works as expected.
  });

  test("works: set password", async function () {
    // Test that setting a new password for a user works.
  });

  test("not found if no such user", async function () {
    // Test that updating a non-existent user results in a NotFoundError.
  });

  test("bad request if no data", async function () {
    // Test that updating with no data results in a BadRequestError.
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    // Test that user removal works as expected.
  });

  test("not found if no such user", async function () {
    // Test that attempting to remove a non-existent user results in a NotFoundError.
  });
});