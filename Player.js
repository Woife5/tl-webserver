const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    steamId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
});

playerSchema.methods.setSteamId = function (steamId) {
    if (steamId && steamId.trim().length > 0) {
        this.steamId = steamId;
    } else {
    }
};

playerSchema.methods.setUsername = function (username) {
    if (username && username.trim().length > 0) {
        if (!this.username || this.username !== username) {
            this.username = username;
        }
    } else {
    }
};

playerSchema.methods.updateScore = function (score) {
    if (score > 0) {
        this.score += score;
    } else {
    }
};

playerSchema.methods.setScore = function (score) {
    if (score > 0) {
        this.score = score;
    } else {
    }
};

playerSchema.methods.getData = function () {
    return {
        username: this.username,
        score: this.score,
    };
};

const playerModel = mongoose.model('Player', playerSchema);

module.exports = playerModel;
