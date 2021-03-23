const mysql = require('mysql');
const config = require('config');
const dbConfig = config.get('db.config');


/**
 * @author Pranay P
 * @Description This piece of code determines the connection of mysql database to the application
 */
module.exports = {

    /**
     * 
     * @param {*} query 
     * @param {*} params 
     * @returns data
     */

    execute: (query, params) => new Promise((resolve, reject) => {
        try {
            const connection = mysql.createConnection({
                host : dbConfig.host,
                user : dbConfig.user,
                password : dbConfig.password,
                database : dbConfig.database,
                typCast : (field, useDefaultTypeCasting) => {
                    try {
                        if (field.type === 'BIT' && field.length === 1) {
                            const bytes = field.buffer();
                            return bytes[0] === 1;
                        }
                        return useDefaultTypeCasting();
                    } catch (error) {
                        console.log(`Casting Failed: ${error}`);
                    }
                },
            });
            connection.config.queryFormat = (q, values) => {
                try {
                    if (!values) {
                        return q;
                    }
                    if (q.indexOf(':') === -1) {
                        return mysql.format(q, values);
                    }
                    const finalQuery =q.replace(/:(\w+)/g, (txt, key) => {
                        if (values.hasOwnProperty(key)) {
                            return this.escape(values[key]);
                        }
                        return txt;
                    })
                    return finalQuery;
                } catch (_) {
                    return q;
                }
            }
            connection.connect();
            connection.query(query, params, (error, data) => {
                try {
                    connection.end();
                    if (error) {
                        return reject(error);
                    }
                    return resolve(data);
                } catch (error) {
                    return reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}

