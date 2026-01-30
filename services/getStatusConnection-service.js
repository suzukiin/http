const { exec } = require('child_process');
const logger = require('./logger');

/**
 * Verifica se o dispositivo tem conectividade com a internet através de ping.
 * @returns {Promise<boolean>}
 */
exports.checkInternetConnection = () => {
    return new Promise((resolve) => {
        // Tenta dar ping no DNS do Google (8.8.8.8) com 1 pacote e timeout de 2 segundos
        exec('ping -c 1 -W 2 8.8.8.8', (error) => {
            if (error) {
                // Não logamos como erro fatal pois é esperado que falhe se estiver offline
                logger.debug('Ping falhou: Host inacessível');
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};
