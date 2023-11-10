/* eslint-disable no-undef */
require("dotenv").config();
const pg = require("pg");

const db = new pg.Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

// Mencoba melakukan koneksi ke database
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Terhubung ke database!");
});

module.exports = db;
