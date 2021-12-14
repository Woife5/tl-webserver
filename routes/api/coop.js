const express = require('express');
const DatabaseModelError = require('../../models/DatabaseModelError');
const router = express.Router();

const Player = require('../../models/Player');

// LOCATION: /api/coop

router.get('/stats/global', async (req, res) => {
    try {
        const players = await Player.find({}).sort({ 'coop.maxWave': -1 }).exec();
        const coopStats = players.map(player => player.getCoopData());
        res.json({ success: true, data: coopStats });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

router.get('/stats/global/sort/:orderBy', async (req, res) => {
    const orderBy = req.params.orderBy;

    if (!Player.getCoopStatFields().includes(orderBy)) {
        return res.status(400).json({ success: false, error: 'Invalid orderBy.' });
    }

    const orderString = `{ "coop.${orderBy}": -1 }`;
    try {
        const players = await Player.find({}).sort(JSON.parse(orderString)).exec();
        const coopStats = players.map(player => player.getCoopData());
        res.json({ success: true, data: coopStats });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

router.get('/stats/player/:steamId', async (req, res) => {
    const steamId = req.params.steamId;
    try {
        const player = await Player.findOne({ steamId });
        if (!player) {
            playerNotFound(res);
        } else {
            res.json({ success: true, data: player.getCoopData() });
        }
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

function playerNotFound(res) {
    res.status(404).json({ success: false, error: 'Player not found.' });
}

module.exports = router;
