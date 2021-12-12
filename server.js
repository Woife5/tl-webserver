const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { VIRTUAL_PORT = 3000, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Player = require('./Player');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/highscores', async (req, res) => {
    const highscores = await Player.find({}).sort({ score: -1 }).limit(20);

    res.json(highscores.map(player => player.getData()));
});

app.post('/api/save', async (req, res) => {
    const { steamId, username, score } = req.body;

    try {
        const player = await Player.findOne({ steamId: steamId }).exec();

        if (player) {
            player.updateScore(score);
            player.setUsername(username);
            const result = await player.save();
            res.json({ success: true, result: result.getData() });
        } else {
            const newPlayer = new Player();
            newPlayer.setSteamId(steamId);
            newPlayer.setUsername(username);
            newPlayer.setScore(score);

            const r = await newPlayer.save();
            res.json({ success: true, result: r });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(VIRTUAL_PORT, () => {
    console.log(`listening on ${VIRTUAL_PORT}`);
});
