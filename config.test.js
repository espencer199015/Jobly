"use strict";

describe("config can come from env", function () {
  test("works", function() {
    // Simulate setting environment variables for testing purposes
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    // Import the configuration module
    const config = require("./config");

    // Test that the config variables are correctly set based on the environment variables
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12); // For non-test use

    // Reset the environment variables
    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    // Test that getDatabaseUri() returns the default value when NODE_ENV is not set to "test"
    expect(config.getDatabaseUri()).toEqual("jobly");

    // Set NODE_ENV to "test"
    process.env.NODE_ENV = "test";

    // Test that getDatabaseUri() returns the test database URI
    expect(config.getDatabaseUri()).toEqual("jobly_test");
  });
})
