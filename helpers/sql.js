const { BadRequestError } = require("../expressError");

// Function: sqlForPartialUpdate
// Parameters:
// - dataToUpdate: an object containing the data to be updated
// - jsToSql: a mapping object that specifies the SQL column names
// Returns: An object with 'setCols' and 'values' properties for SQL updates
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // Get the keys (column names) from the 'dataToUpdate' object
  const keys = Object.keys(dataToUpdate);

  // If there are no keys, throw a BadRequestError
  if (keys.length === 0) throw new BadRequestError("No data");

  // Map the keys to SQL column names and parameter placeholders
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  // Return an object with 'setCols' as a comma-separated string of SQL assignments
  // and 'values' as an array of values from the 'dataToUpdate' object
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// Export the 'sqlForPartialUpdate' function for use in other modules
module.exports = { sqlForPartialUpdate };

