const express = require('express');
const getUptimeService = require('../services/getUptime-service');
const getStatusService = require('../services/getStatusConnection-service');
const getTrafficService = require('../services/getTraffic-service');
const getLogsService = require('../services/getLogs-service');
const dbService = require('../services/database-service');
const router = express.Router();

router.get('/', async (req, res) => {
    // Executando serviços em paralelo para melhorar a performance
    const [systemUptime, traffic, isOnline, watchdogLog, initLog, telemetry] = await Promise.all([
        getUptimeService.getUptime(),
        getTrafficService.getPPP0Traffic(),
        getStatusService.checkInternetConnection(),
        getLogsService.getWatchdogLog(),
        getLogsService.getInitLog(),
        dbService.getTelemetry()
    ]);

    const statusConnection = isOnline ? 'ONLINE' : 'OFFLINE';

    res.render('home', { 
        systemUptime, 
        statusConnection,
        isOnline,
        traffic,
        watchdogLog,
        initLog,
        // Dados para a navbar (vindos da tabela telemetry)
        hostname: telemetry.hostname || 'JUPITER-DEVICE',
        localization: telemetry.localization || 'Localização não definida',
        client: telemetry.client || 'Cliente não definido',
        serial_number: telemetry.serial_number || 'S/N',
        ip_vpn: telemetry.ip_vpn || '0.0.0.0',
        ip_lan: telemetry.ip_lan || '0.0.0.0',
        firmware_version: telemetry.firmware_version || 'v1.0.0'
    });
});

module.exports = router;