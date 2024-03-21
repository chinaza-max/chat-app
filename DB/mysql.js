const mysql = require('mysql');

const pool = mysql.createPool({
  host: '3s9.h.filess.io',
  user: 'chat_seedeaten',
  password: 'ff2bc9b5face448b072525661aaeec4e73495f8a',
  database: 'chat_seedeaten',
  port: 3307,
  connectionLimit: 10,
  acquireTimeout: 10000,
  // The maximum number of connection attempts to make before
  // giving up (default: 10 attempts)
  connectionTimeout: 10000,
  // The maximum number of connections that can be open at any
  // given time (default: 10 connections)
  queueLimit: 0,
  // The maximum number of connections that can be queued (default: no limit)
  debug: false, // Enable debugging log messages (default: false)
});

const createDatabase = (callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return callback(err);
    }

    // Use the connection to execute queries
    console.log('Connected to the database!');

    // Check if the database exists
    connection.query('SHOW DATABASES LIKE \'chat_seedeaten\'', (error, rows) => {
      if (error) {
        console.error('Error executing the query:', error);
        return callback(error);
      }

      if (rows.length === 0) {
        // Create the database if it doesn't exist
        connection.query('CREATE DATABASE IF NOT EXISTS chat_seedeaten', (error, results, fields) => {
          if (error) {
            console.error('Error executing the query:', error);
            return callback(error);
          }
          console.log('Database created!');
          callback(null, connection);
        });
      } else {
        console.log('Database already exists!');
        callback(null, connection);
      }
    });

    // Release the connection back to the pool
    // connection.release();
  });
};

createDatabase((error, connection) => {
  if (error) {
    console.error('Error creating the database:', error);
    process.exit();
  }

  // Use the connection to execute queries
  console.log('Database connection established:', connection.threadId);

  // Release the connection back to the pool
  // connection.release();
});

module.exports = pool;