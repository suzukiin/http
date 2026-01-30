const fs = require('fs').promises;
require('dotenv').config();
const logger = require('./logger');
const utils = require('./utils');

const WATCHDOG_LOG = process.env.LOG_PATH_WATCHDOG || '/var/log/watchdog.log';
const INIT_LOG = process.env.LOG_PATH_INIT || '/var/log/init.log';

exports.getWatchdogLog = async () => {
    try {
        const data = await fs.readFile(WATCHDOG_LOG, 'utf8');
        return utils.formatLogWithIndex(data);
    } catch (err) {
        logger.error(`Falha ao ler log do watchdog: ${WATCHDOG_LOG}`, err);
        return [];
    }
}

exports.getInitLog = async () => {
    try {
        const data = await fs.readFile(INIT_LOG, 'utf8');
        return utils.formatLogWithIndex(data);
    } catch (err) {
        logger.error(`Falha ao ler log do init: ${INIT_LOG}`, err);
        return [];
    }
}
