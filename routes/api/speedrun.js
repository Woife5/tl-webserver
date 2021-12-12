const express = require('express');
const DatabaseModelError = require('../../models/DatabaseModelError');
const router = express.Router();

const Player = require('../../models/Player');

// LOCATION: /api/speedrun

router.get('/', async (req, res) => {
    const scores = await Player.find({}).exec();
});

router.get('/:steamId', async (req, res) => {
    try {
        const score = await Player.findOne({ steamId: req.params.steamId }).exec();
        if (score) {
            res.json({ success: true, data: score });
        } else {
            playerNotFound(res);
        }
    } catch (err) {
        if (err instanceof DatabaseModelError) {
            res.status(400).json(err);
        } else {
            res.status(500).json(err);
        }
    }
});

function playerNotFound(res) {
    res.status(404).json({ success: false, error: 'Player not found.' });
}

module.exports = router;
