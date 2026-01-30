const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const logger = require('./logger');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../../var/jupiter/database/JUPITER_DB');

let db;

function getDbConnection() {
    if (!db) {
        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                logger.error('Erro ao conectar ao banco de dados:', err);
            } else {
                logger.info('Conectado ao SQLite com sucesso.');
            }
        });
    }
    return db;
}

exports.getVirtualInputs = async () => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `SELECT * FROM virtual_inputs`;

        connection.all(query, [], (err, rows) => {
            if (err) {
                logger.error('Erro ao executar a consulta query:', err);
                return reject(err);
            }
            resolve(rows || []);
        });
    });
};

exports.getTelemetry = async () => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `SELECT * FROM telemetry LIMIT 1`;

        connection.get(query, [], (err, row) => {
            if (err) {
                logger.error('Erro ao buscar dados de telemetria:', err);
                return reject(err);
            }
            resolve(row || {});
        });
    });
};
