const fs = require('fs').promises;
const path = require('path');

exports.getWatchdogLog = async () => {
    try {
        const logPath = path.join(__dirname, '../../../var/log/watchdog.log');
        const data = await fs.readFile(logPath, 'utf8');
        return data;
    } catch (err) {
        console.error('Erro ao ler o arquivo de log:', err);
        return err;
    }
}

exports.getInitLog = async () => {
    try {
        const logPath = path.join(__dirname, '../../../var/log/init.log');
        const data = await fs.readFile(logPath, 'utf8');
        return data;
    } catch (err) {
        console.error('Erro ao ler o arquivo de log:', err);
        return err;
    }
}
