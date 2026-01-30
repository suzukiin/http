const express = require('express');
const router = express.Router();
const dbService = require('../services/database-service');

// Página de configuração (GET)
router.get('/', async (req, res) => {
    const [virtualInputs, telemetry] = await Promise.all([
        dbService.getVirtualInputs(),
        dbService.getTelemetry()
    ]);

    res.render('config', {
        virtualInputs,
        activePage: 'config',
        // Mantemos os dados da navbar
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

// Salvar configurações (POST de atualização)
router.post('/update', async (req, res) => {
    const { id, descricao, tipo, ip, oid, mascara, unidade } = req.body;
    
    await dbService.updateVirtualInput(id, {
        descricao,
        tipo,
        ip,
        oid,
        mascara: tipo === 'medidas' ? mascara : null,
        unidade: tipo === 'medidas' ? unidade : null
    });

    res.redirect('/config?success=true');
});

// Adicionar novo input (POST)
router.post('/add', async (req, res) => {
    const { descricao, tipo, ip, oid, mascara, unidade } = req.body;
    
    await dbService.addVirtualInput({
        descricao,
        tipo,
        ip,
        oid,
        mascara: tipo === 'medidas' ? mascara : null,
        unidade: tipo === 'medidas' ? unidade : null
    });

    res.redirect('/config?success=true');
});

// Deletar input (POST)
router.post('/delete', async (req, res) => {
    const { id } = req.body;
    await dbService.deleteVirtualInput(id);
    res.redirect('/config?success=true');
});

module.exports = router;

module.exports = router;
