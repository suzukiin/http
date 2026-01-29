exports.formatLogWithIndex = (logData) => {
    return logData.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line) => `${line}`);
};
