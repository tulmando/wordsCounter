// support flexibility with the db.

const dbType = process.env.DB || "lokiWords";
const db = require('./' + dbType);

module.exports = db;
