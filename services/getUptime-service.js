const fs = require('fs').promises;
const logger = require('./logger');

exports.getUptime = async () => {
    try {
        const data = await fs.readFile('/proc/uptime', 'utf8');
        const uptimeSeconds = parseFloat(data.split(' ')[0]);
        return formatUptime(uptimeSeconds);
    } catch (err) {
        logger.error('Erro ao ler o uptime do sistema:', err);
        return 'Indisponível';
    }
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let uptimeString = '';
    if (days > 0) uptimeString += `${days}d `;
    if (hours > 0 || days > 0) uptimeString += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) uptimeString += `${minutes}m `;
    uptimeString += `${seconds}s`;

    return uptimeString.trim();
}