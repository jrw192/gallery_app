const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gallery_users',
  password: 'password',
  port: 5432,
});

const getUsers = async () => {
  console.log('getUsers');
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM gallery_users", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
}

const getUserNames = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT username FROM gallery_users", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
}

const getUserByName = async (id) => {
  console.log('getUserByName');
  console.log('id: ', id);
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM gallery_users WHERE username = $1 LIMIT 1", [id], (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
}

const createUser = (body) => {
  return new Promise(function (resolve, reject) {
    const {username, password} = body;
    pool.query(
      "INSERT INTO gallery_users VALUES ($1, $2)",
      [username, password],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

module.exports = {
  getUsers,
  getUserNames,
  getUserByName,
  createUser
};