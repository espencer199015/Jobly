const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

// Test suite for the 'createToken' function
describe("createToken", function () {

  // Test case: Token creation for a non-admin user
  test("works: not admin", function () {
    // Create a token for a user with the 'is_admin' property set to 'false'
    const token = createToken({ username: "test", is_admin: false });
    // Verify the token and check its payload
    const payload = jwt.verify(token, SECRET_KEY);
    // Ensure that the payload matches the expected structure
    expect(payload).toEqual({
      iat: expect.any(Number), // 'iat' is a timestamp
      username: "test",
      isAdmin: false,
    });
  });

  // Test case: Token creation for an admin user
  test("works: admin", function () {
    // Create a token for a user with the 'isAdmin' property set to 'true'
    const token = createToken({ username: "test", isAdmin: true });
    // Verify the token and check its payload
    const payload = jwt.verify(token, SECRET_KEY);
    // Ensure that the payload matches the expected structure
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: true,
    });
  });

  // Test case: Token creation for a user without 'isAdmin' property (default to no admin)
  test("works: default no admin", function () {
    // Create a token for a user without the 'isAdmin' property
    // This test checks the default behavior for non-admin users
    const token = createToken({ username: "test" });
    // Verify the token and check its payload
    const payload = jwt.verify(token, SECRET_KEY);
    // Ensure that the payload matches the expected structure, with 'isAdmin' defaulting to 'false'
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
    });
  });
});