/**
 * Formata os logs em um array de strings numeradas.
 * @param {string} logData - O conteúdo bruto do log.
 * @returns {string[]} Array de linhas formatadas.
 */
exports.formatLogWithIndex = (logData) => {
    if (typeof logData !== 'string') {
        return [];
    }

    return logData.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line) => `${line}`);
};
