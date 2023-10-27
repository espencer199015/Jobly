"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const JobApplication = require("./jobApplication");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  // Existing code...

  /** Apply for a job.
   *
   * Returns true if successful.
   *
   * Throws NotFoundError if not found.
   **/

  static async applyToJob(username, jobId) {
    // This function allows a user to apply for a job by checking if the job exists and calling the apply function in JobApplication.
    const result = await db.query(
      `SELECT id
       FROM jobs
       WHERE id = $1`,
      [jobId]
    );

    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with ID: ${jobId}`);

    await JobApplication.apply(username, jobId);
    return true;
  }

  /** Get jobs that the user has applied to.
   *
   * Returns [{ id, title, company_handle, company_name, state }, ...]
   **/

  static async getAppliedJobs(username) {
    // This function retrieves a list of jobs that the user has applied to along with associated company information.
    const result = await db.query(
      `SELECT j.id,
                  j.title,
                  j.company_handle AS "companyHandle",
                  c.name AS "companyName",
                  c.state
           FROM job_applications AS ja
                    JOIN jobs AS j ON ja.job_id = j.id
                    JOIN companies AS c ON j.company_handle = c.handle
           WHERE ja.username = $1
           ORDER BY j.id`,
      [username]
    );

    return result.rows;
  }

  /** Update user profile data.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password.
   * Callers of this function must be certain they have validated inputs to this
   * or serious security risks are opened.
   */

static async updateProfile(username, data) {
  // This function allows users to update their profile data, including changing their password if provided.
  if (data.password) {
    data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  }

  const { setCols, values } = sqlForPartialUpdate(data, {
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
  });
  const usernameVarIdx = "$" + (values.length + 1);

  const querySql = `UPDATE users 
                    SET ${setCols} 
                    WHERE username = ${usernameVarIdx} 
                    RETURNING username,
                              first_name AS "firstName",
                              last_name AS "lastName",
                              email,
                              is_admin AS "isAdmin"`;
  const result = await db.query(querySql, [...values, username]);
  const user = result.rows[0];

  if (!user) throw new NotFoundError(`No user: ${username}`);

  delete user.password;
  return user;
}};