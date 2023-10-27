const request = require("supertest");
const app = require("./app");
const db = require("./db");

test("not found for site 404", async function () {
  // Send a GET request to a non-existent path and expect a 404 status code.
  const resp = await request(app).get("/no-such-path");
  expect(resp.statusCode).toEqual(404);
});

test("not found for site 404 (test stack print)", async function () {
  // Simulate an environment where NODE_ENV is not set (for test stack print).
  process.env.NODE_ENV = "";

  // Send a GET request to a non-existent path and expect a 404 status code.
  const resp = await request(app).get("/no-such-path");
  expect(resp.statusCode).toEqual(404);

  // Delete the temporary NODE_ENV variable to clean up.
  delete process.env.NODE_ENV;
});

afterAll(function () {
  // Close the database connection after all tests are done.
  db.end();
});
