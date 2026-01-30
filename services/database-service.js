const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const logger = require('./logger');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../../var/jupiter/database/JUPITER_DB');

let db;

function getDbConnection() {
    if (!db) {
        // Removido OPEN_READONLY para permitir INSERT/UPDATE/DELETE
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                logger.error('Erro ao conectar ao banco de dados:', err);
            } else {
                logger.info('Conectado ao SQLite com sucesso (Modo RW).');
                // Criar tabela NAT se não existir
                db.run(`CREATE TABLE IF NOT EXISTS nat_rules (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    descricao TEXT NOT NULL,
                    public_port INTEGER NOT NULL,
                    private_ip TEXT NOT NULL,
                    private_port INTEGER NOT NULL,
                    protocol TEXT NOT NULL CHECK(protocol IN ('TCP', 'UDP', 'BOTH'))
                )`);
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

exports.updateVirtualInput = async (id, data) => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `UPDATE virtual_inputs SET oid = ?, descricao = ?, ip = ?, tipo = ?, mascara = ?, unidade = ? WHERE id = ?`;
        
        connection.run(query, [
            data.oid, 
            data.descricao, 
            data.ip, 
            data.tipo, 
            data.mascara || null, 
            data.unidade || null, 
            id
        ], function(err) {
            if (err) {
                logger.error('Erro ao atualizar input virtual:', err);
                return reject(err);
            }
            resolve(this.changes);
        });
    });
};

exports.addVirtualInput = async (data) => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `INSERT INTO virtual_inputs (oid, descricao, ip, tipo, mascara, unidade) VALUES (?, ?, ?, ?, ?, ?)`;
        
        connection.run(query, [
            data.oid, 
            data.descricao, 
            data.ip, 
            data.tipo, 
            data.mascara || null, 
            data.unidade || null
        ], function(err) {
            if (err) {
                logger.error('Erro ao adicionar novo input virtual:', err);
                return reject(err);
            }
            resolve(this.lastID);
        });
    });
};

exports.deleteVirtualInput = async (id) => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `DELETE FROM virtual_inputs WHERE id = ?`;
        
        connection.run(query, [id], function(err) {
            if (err) {
                logger.error('Erro ao deletar input virtual:', err);
                return reject(err);
            }
            resolve(this.changes);
        });
    });
};

// --- NAT RULES METHODS ---

exports.getNatRules = async () => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `SELECT * FROM nat_rules`;
        connection.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows || []);
        });
    });
};

exports.addNatRule = async (data) => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `INSERT INTO nat_rules (descricao, public_port, private_ip, private_port, protocol) VALUES (?, ?, ?, ?, ?)`;
        connection.run(query, [data.descricao, data.public_port, data.private_ip, data.private_port, data.protocol], function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

exports.updateNatRule = async (id, data) => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `UPDATE nat_rules SET descricao = ?, public_port = ?, private_ip = ?, private_port = ?, protocol = ? WHERE id = ?`;
        connection.run(query, [data.descricao, data.public_port, data.private_ip, data.private_port, data.protocol, id], function(err) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};

exports.deleteNatRule = async (id) => {
    return new Promise((resolve, reject) => {
        const connection = getDbConnection();
        const query = `DELETE FROM nat_rules WHERE id = ?`;
        connection.run(query, [id], function(err) {
            if (err) return reject(err);
            resolve(this.changes);
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
