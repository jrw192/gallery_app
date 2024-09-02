const {
  Pool
} = require('pg');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
const pool = new Pool({
  user: process.env.REACT_APP_DB_USER,
  host: process.env.REACT_APP_DB_HOST,
  database: process.env.REACT_APP_DB_NAME,
  password: process.env.REACT_APP_DB_PASSWORD,
  port: process.env.REACT_APP_DB_PORT
});
const saveCity = body => {
  return new Promise(function (resolve, reject) {
    const {
      place,
      city,
      region,
      country
    } = body;
    pool.query("INSERT INTO cities VALUES ($1, $2, $3, $4)", [place, city, region, country], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};
const getCities = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT place FROM cities ORDER BY region ASC, place", (error, results) => {
      if (results && results.rows) {
        const formatted = results.rows.map(row => row['place']);
        resolve(formatted);
      } else {
        reject(new Error("No results found"));
      }
    });
  });
};
module.exports = {
  saveCity,
  getCities
};