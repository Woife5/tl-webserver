const express = require('express');
const DatabaseModelError = require('../../models/DatabaseModelError');
const router = express.Router();

const Player = require('../../models/Player');

// LOCATION: /api/speedrun

router.get('/level/:levelName', async (req, res) => {
    const levelName = req.params.levelName;
    try {
        // Seach for players which have completed a speedrun on the requested level
        // { "speedruns.Surrounded": { $gt: 0} }
        const searchString = `{ "speedruns.${levelName}" : { "$gt": 0 } }`;
        const searchQuery = JSON.parse(searchString);

        // Set the sorting string to ascending order
        // { "speedruns.Surrounded": 1 }
        const sortString = `{ "speedruns.${levelName}" : 1 }`;
        const sortQuery = JSON.parse(sortString);

        const players = await Player.find(searchQuery).sort(sortQuery).exec();

        // Only get the relevant data from the DB result
        const result = players.map(player => {
            return {
                steamId: player.steamId,
                username: player.username,
                time: player.speedruns[levelName],
            };
        });
        res.json({ success: true, data: result });
    } catch (err) {
        let obj = { success: false, error: err.message };

        if (err instanceof DatabaseModelError) {
            res.status(400).json(obj);
        } else {
            res.status(500).json(obj);
        }
    }
});

router.get('/player/:steamId', async (req, res) => {
    const steamId = req.params.steamId;
    try {
        const player = await Player.findOne({ steamId: steamId }).exec();
        if (!player) {
            return playerNotFound(res);
        }

        let result = {
            steamId: player.steamId,
            username: player.username,
        };

        // Add the global rank of the player to every single speedrun
        const LEVELS = Player.getSpeedrunLevels();
        for (level of LEVELS) {
            if (player.speedruns[level] > 0) {
                // Find all players that have a speedrun on this level (gt 0) and are better than the player (lt playertime)
                const searchString = `{ "speedruns.${level}" : { "$gt": 0, "$lt": ${player.speedruns[level]} } }`;
                const searchQuery = JSON.parse(searchString);

                const rank = await Player.find(searchQuery).count().exec();
                result[level] = {
                    time: player.speedruns[level],
                    rank: rank + 1,
                };
            } else {
                result[level] = {
                    time: 0,
                    rank: 0,
                };
            }
        }

        res.json({ success: true, data: result });

        // Get the rank of the player for every level
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
