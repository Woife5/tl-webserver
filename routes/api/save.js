const express = require('express');
const DatabaseModelError = require('../../models/DatabaseModelError');
const router = express.Router();

const Player = require('../../models/Player');

// LOCATION: /api/save

router.get('/:steamId', async (req, res) => {
    const steamId = req.params.steamId;

    try {
        const player = await Player.findOne({ steamId: steamId });
        if (!player) {
            playerNotFound(res);
            return;
        }
        res.json({ success: true, data: player.getData() });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

router.post('/', async (req, res) => {
    const { steamId, username, storyCompleted } = req.body;

    try {
        let player = await Player.findOne({ steamId: steamId });
        if (!player) {
            player = createPlayer(steamId);
        }

        if (username) player.setUsername(username);
        if (storyCompleted !== undefined) player.setStoryCompleted(storyCompleted);

        const data = await player.save();
        res.json({ success: true, data: data.getData() });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

// Temporary solution for adding a skin to a player
// Will be removed when the final game releases
router.post('/skin', async (req, res) => {
    const { steamId, skin } = req.body;

    try {
        let player = await Player.findOne({ steamId: steamId });
        if (!player) {
            player = createPlayer(steamId);
        }

        player.setSkin(skin);

        const data = await player.save();
        res.json({ success: true, data: data.getData() });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

router.post('/speedrun', async (req, res) => {
    const { steamId, username, level, time } = req.body;

    try {
        let player = await Player.findOne({ steamId: steamId });
        if (!player) {
            player = createPlayer(steamId);
        }

        if (username) player.setUsername(username);

        const newBest = player.setSpeedrun(level, time);

        if (newBest) {
            await player.save();
        }
        const data = player.getData();

        res.json({ success: true, data: data, newBest: newBest });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

router.post('/coop', async (req, res) => {
    const { steamId, username, kills, headshots, maxWave, score, gamesPlayed = 0 } = req.body;

    try {
        let player = await Player.findOne({ steamId: steamId });
        if (!player) {
            player = createPlayer(steamId);
        }

        if (username) player.setUsername(username);

        player.updateCoopData(kills, headshots, maxWave, score, gamesPlayed);

        const data = await player.save();
        res.json({ success: true, data: data.getData() });
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

function createPlayer(steamId) {
    const player = new Player();
    player.setSteamId(steamId);
    player.setUsername('No Name');
    player.setStoryCompleted(false);
    return player;
}

module.exports = router;
