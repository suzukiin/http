const express = require('express');
const router = express.Router();
const dbService = require('../services/database-service');

// Página de NAT (GET)
router.get('/', async (req, res) => {
    const [natRules, telemetry] = await Promise.all([
        dbService.getNatRules(),
        dbService.getTelemetry()
    ]);

    res.render('nat', {
        natRules,
        activePage: 'nat',
        // Navbar data
        hostname: telemetry.hostname,
        localization: telemetry.localization,
        client: telemetry.client,
        serial_number: telemetry.serial_number,
        ip_vpn: telemetry.ip_vpn,
        ip_lan: telemetry.ip_lan,
        firmware_version: telemetry.firmware_version,
        success: req.query.success === 'true'
    });
});

// Adicionar regra NAT
router.post('/add', async (req, res) => {
    const { descricao, public_port, private_ip, private_port, protocol } = req.body;
    await dbService.addNatRule({ descricao, public_port, private_ip, private_port, protocol });
    res.redirect('/nat?success=true');
});

// Atualizar regra NAT
router.post('/update', async (req, res) => {
    const { id, descricao, public_port, private_ip, private_port, protocol } = req.body;
    await dbService.updateNatRule(id, { descricao, public_port, private_ip, private_port, protocol });
    res.redirect('/nat?success=true');
});

// Deletar regra NAT
router.post('/delete', async (req, res) => {
    const { id } = req.body;
    await dbService.deleteNatRule(id);
    res.redirect('/nat?success=true');
});

module.exports = router;
