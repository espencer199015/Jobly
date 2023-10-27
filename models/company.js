"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in the database.
   */
  static async create({ handle, name, description, numEmployees, logoUrl }) {
    // Check for duplicate company handle in the database
    const duplicateCheck = await db.query(
      `SELECT handle
       FROM companies
       WHERE handle = $1`,
      [handle]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate company: ${handle}`);
    }

    // Insert the new company data into the database
    const result = await db.query(
      `INSERT INTO companies
       (handle, name, description, num_employees, logo_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [handle, name, description, numEmployees, logoUrl]
    );

    const company = result.rows[0];
    return company;
  }

  /** Find all companies.
   *
   * Returns an array of objects containing company information: { handle, name, description, numEmployees, logoUrl }
   */
  static async findAll() {
    const companiesRes = await db.query(
      `SELECT handle,
              name,
              description,
              num_employees AS "numEmployees",
              logo_url AS "logoUrl"
       FROM companies
       ORDER BY name`
    );
    return companiesRes.rows;
  }

  /** Given a company handle, return data about the company.
   *
   * Returns an object containing company information: { handle, name, description, numEmployees, logoUrl, jobs }
   * where 'jobs' is an array of job objects: [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if the company is not found.
   */
  static async get(handle) {
    const companyRes = await db.query(
      `SELECT handle,
              name,
              description,
              num_employees AS "numEmployees",
              logo_url AS "logoUrl"
       FROM companies
       WHERE handle = $1`,
      [handle]
    );

    const company = companyRes.rows[0];

    if (!company) {
      throw new NotFoundError(`No company: ${handle}`);
    }

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" — it only changes provided fields.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns an object containing updated company information: { handle, name, description, numEmployees, logoUrl }
   *
   * Throws NotFoundError if the company is not found.
   */
  static async update(handle, data) {
    // Generate SQL for the partial update using the 'sqlForPartialUpdate' helper function
    const { setCols, values } = sqlForPartialUpdate(data, {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    });

    const handleVarIdx = "$" + (values.length + 1);

    // Execute the SQL query to update the company data
    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;

    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) {
      throw new NotFoundError(`No company: ${handle}`);
    }

    return company;
  }

  /** Filter companies based on minEmployees, maxEmployees, and nameLike.
   *
   * Returns an array of objects containing company information: { handle, name, description, numEmployees, logoUrl }
   */
  static async filterCompanies(minEmployees, maxEmployees, nameLike) {
    // Define filters object to construct the SQL query based on input criteria
    const filters = {};

    if (minEmployees) filters.minEmployees = minEmployees;
    if (maxEmployees) filters.maxEmployees = maxEmployees;
    if (nameLike) filters.nameLike = nameLike;

    // Execute the SQL query with filters to retrieve filtered company data
    const companiesRes = await db.query(
      `SELECT handle,
              name,
              description,
              num_employees AS "numEmployees",
              logo_url AS "logoUrl"
       FROM companies
       WHERE ($1::INT IS NULL OR num_employees >= $1)
         AND ($2::INT IS NULL OR num_employees <= $2)
         AND ($3::VARCHAR IS NULL OR lower(name) LIKE '%' || lower($3::VARCHAR) || '%')
       ORDER BY name`,
      [filters.minEmployees, filters.maxEmployees, filters.nameLike]
    );

    return companiesRes.rows;
  }

  /** Delete the given company from the database; returns undefined.
   *
   * Throws NotFoundError if the company is not found.
   */
  static async remove(handle) {
    const result = await db.query(
      `DELETE
       FROM companies
       WHERE handle = $1
       RETURNING handle`,
      [handle]
    );

    const company = result.rows[0];

    if (!company) {
      throw new NotFoundError(`No company: ${handle}`);
    }
  }
}

module.exports = Company;