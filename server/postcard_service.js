const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.REACT_APP_DB_USER,
    host: process.env.REACT_APP_DB_HOST,
    database: process.env.REACT_APP_DB_NAME,
    password: process.env.REACT_APP_DB_PASSWORD,
    port: process.env.REACT_APP_DB_PORT,
});


const getAllPostcards = async () => {
    console.log('getAllPostcards');
    try {
        return await new Promise(function (resolve, reject) {
            pool.query("SELECT * FROM postcards", (error, results) => {
                if (error) {
                    reject(error);
                }
                if (results && results.rows) {
                    resolve(results.rows);
                } else {
                    reject(new Error("No postcards found"));
                    // resolve([]);
                }
            });
        });
    } catch (error_1) {
        console.error(error_1);
        throw new Error("Internal server error");
    }

}

const getPostcardById = async (id) => {
    try {
        return await new Promise(function (resolve, reject) {
            pool.query("SELECT * FROM postcards WHERE id = $1 LIMIT 1", [id], (error, results) => {
                if (error) {
                    reject(error);
                }
                if (results && results.rows.length > 0) {
                    resolve(results.rows[0]);
                } else {
                    reject(new Error("No results found"));
                }
            });
        });
    } catch (error_1) {
        console.error(error_1);
        // throw new Error("Internal server error");
    }

}

const savePostcard = (postcard) => {
    return new Promise(function (resolve, reject) {
        pool.query(
            "INSERT INTO postcards VALUES ($1, $2, $3, $4, $5, $6)",
            [postcard['id'],
            postcard['creator'],
            postcard['location'],
            postcard['date'],
            postcard['title'],
            postcard['message']],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            }
        );
    });
}

module.exports = {
    getAllPostcards,
    getPostcardById,
    savePostcard
};