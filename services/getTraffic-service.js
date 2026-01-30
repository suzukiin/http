const fs = require('fs').promises;
require('dotenv').config();
const logger = require('./logger');

const IFACE = process.env.NETWORK_INTERFACE || 'ppp0';

/**
 * Obtém o tráfego de dados (RX e TX bytes) da interface configurada.
 * @returns {Promise<Object>}
 */
exports.getPPP0Traffic = async () => {
    try {
        const data = await fs.readFile('/proc/net/dev', 'utf8');
        const lines = data.split('\n');
        
        for (const line of lines) {
            if (line.includes(`${IFACE}:`)) {
                const trafficMb = convertToMb(line);
                const percent = calculatePercentage(trafficMb);
                return {
                    rx: `${trafficMb.rx} MB`,
                    tx: `${trafficMb.tx} MB`,
                    rxPercent: percent.rxPercent,
                    txPercent: percent.txPercent
                };
            }
        }
        
        logger.warn(`Interface de rede ${IFACE} não encontrada.`);
        return { rx: '0 MB', tx: '0 MB', rxPercent: 0, txPercent: 0 };
    } catch (error) {
        logger.error('Erro ao ler tráfego de rede:', error);
        return { rx: 'N/A', tx: 'N/A', rxPercent: 0, txPercent: 0 };
    }
};

function convertToMb(line) {
    const parts = line.trim().split(/\s+/);
    // RX bytes is 2nd col, TX bytes is 10th col
    const rx = (parseInt(parts[1], 10) / (1024 * 1024)).toFixed(2);
    const tx = (parseInt(parts[9], 10) / (1024 * 1024)).toFixed(2);
    return { rx: parseFloat(rx), tx: parseFloat(tx) };
}

function calculatePercentage(traffic) {
    // Definindo 100MB como base para escala (ajustável via config se necessário)
    const MAX_VAL = 100; 
    let rxPercent = Math.min((traffic.rx / MAX_VAL) * 100, 100).toFixed(0);
    let txPercent = Math.min((traffic.tx / MAX_VAL) * 100, 100).toFixed(0);

    return {
        rxPercent: parseInt(rxPercent),
        txPercent: parseInt(txPercent)
    };
}
