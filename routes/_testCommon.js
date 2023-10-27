"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // This function is executed before all tests and sets up a clean database state.
  // It deletes all records from the "users" and "companies" tables.
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM companies");

  // It then creates three sample company records in the "companies" table.
  // These companies are used for testing purposes.
  await Company.create({
    handle: "c1",
    name: "C1",
    numEmployees: 1,
    description: "Desc1",
    logoUrl: "http://c1.img",
  });
  await Company.create({
    handle: "c2",
    name: "C2",
    numEmployees: 2,
    description: "Desc2",
    logoUrl: "http://c2.img",
  });
  await Company.create({
    handle: "c3",
    name: "C3",
    numEmployees: 3,
    description: "Desc3",
    logoUrl: "http://c3.img",
  });

  // It also registers three sample user records in the "users" table.
  // These users are used for testing purposes.
  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
}

async function commonBeforeEach() {
  // This function is executed before each test and starts a new transaction.
  await db.query("BEGIN");
}

async function commonAfterEach() {
  // This function is executed after each test and rolls back the transaction,
  // ensuring a clean database state for each test.
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  // This function is executed after all tests and ends the database connection.
  await db.end();
}

// Create a token for user "u1" with no admin privileges.
const u1Token = createToken({ username: "u1", isAdmin: false });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
};