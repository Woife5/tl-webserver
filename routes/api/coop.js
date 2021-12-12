const express = require('express');
const DatabaseModelError = require('../../models/DatabaseModelError');
const router = express.Router();

const Player = require('../../models/Player');

// LOCATION: /api/coop

router.get('/', async (req, res) => {});

router.get('/:steamId', async (req, res) => {
    try {
    } catch (err) {
        if (err instanceof DatabaseModelError) {
            res.status(400).json(err);
        } else {
            res.status(500).json(err);
        }
    }
});

router.get('/stage/:stage', async (req, res) => {
    try {
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
