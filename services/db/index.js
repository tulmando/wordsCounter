// support flexibility with the db.

const dbType = process.env.DB || "loki";
const db = require('./' + dbType);

module.exports = db;
