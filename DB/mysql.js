const mysql = require('mysql2/promise');
const fs = require('fs');

let caCertBuffer;
try {
  caCertBuffer = fs.readFileSync('./ca-cert.pem').toString();
} catch (error) {
  console.error('Error reading ca-cert.pem:', error);
  process.exit(1);
}

const pool = mysql.createPool({
  host: 'mysql-2a3faea4-mosesogbonna68-8779.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_nAsdR_StFpv3BSX7X7W',
  database: 'defaultdb',
  port: 11389,
  ssl: {
    ca: caCertBuffer,
  },
});

const createDatabase = async (callback) => {
  const connection = await pool.getConnection();

  try {
    console.log('Connected to the database!');

    const [rows] = await connection.query('SHOW DATABASES LIKE ?', ['defaultdb']);

    if (rows.length === 0) {
      console.log('Database does not exist, creating...');

      await connection.query('CREATE DATABASE IF NOT EXISTS defaultdb');

      console.log('Database created!');
    } else {
      console.log('Database already exists.');
    }

    callback(null, connection);
  } catch (error) {
    console.error('Error executing the query:', error);
    callback(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

createDatabase(async (error, connection) => {
  if (error) {
    console.error('Error creating the database:', error);
    process.exit();
  }

  console.log('Database connection established.');

  if (connection) {
    connection.release();
  }
});

module.exports = pool;