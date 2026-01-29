const express = require('express');
const router = express.Router();
const getLogsService = require('../services/getLogs');
const utils = require('../services/utils');

router.get('/watchdog', async (req, res) => {
    const logData = await getLogsService.getWatchdogLog();
    const formattedLogs = utils.formatLogWithIndex(logData);
    res.status(200).send({ log: formattedLogs });
});

router.get('/init', async (req, res) => {
    const logData = await getLogsService.getInitLog();
    const formattedLogs = utils.formatLogWithIndex(logData);
    res.status(200).send({ log: formattedLogs });
});

module.exports = router;