/* eslint-disable no-undef */
require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

// Tangani error pada koneksi pool
db.on('error', (err) => {
  console.error('Database pool error:', err.message);
});

// Coba melakukan koneksi ke database menggunakan async/await
(async () => {
  try {
    await db.connect();
    console.log('Terhubung ke database!');
  } catch (err) {
    console.error('Koneksi ke database gagal:', err.message);
  }
})();

module.exports = db;
