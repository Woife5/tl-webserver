const mongoose = require('mongoose');
const DatabaseModelError = require('./DatabaseModelError');

const SPEEDRUN_LEVELS = ['TheCrossing', 'Surrounded', 'NewAcquaintance', 'Prisoned', 'DarkForest'];

const playerSchema = new mongoose.Schema({
    steamId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    storyCompleted: {
        type: Boolean,
        default: false,
    },
    speedruns: [
        {
            level: {
                type: String,
                enum: SPEEDRUN_LEVELS,
                required: true,
            },
            time: {
                type: Number,
                default: -1,
            },
        },
    ],
    coop: {
        kills: {
            type: Number,
            default: 0,
        },
        headshots: {
            type: Number,
            default: 0,
        },
        maxWave: {
            type: Number,
            default: 0,
        },
        score: {
            type: Number,
            default: 0,
        },
        gamesPlayed: {
            type: Number,
            default: 0,
        },
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

playerSchema.methods.updateCoopData = function (kills, headshots, maxWave, score, gamesPlayed) {
    if (kills > 0) this.coop.kills += kills;
    if (headshots > 0) this.coop.headshots += headshots;
    if (score > 0) this.coop.score += score;
    if (gamesPlayed > 0) this.coop.gamesPlayed += gamesPlayed;

    if (maxWave > 0 && maxWave > this.coop.maxWave) this.coop.maxWave = maxWave;
};

playerSchema.methods.setSpeedrun = function (level, time) {
    if (SPEEDRUN_LEVELS.includes(level)) {
        if (!this.speedruns[level] || this.speedruns[level].time > time) {
            this.speedruns[level] = time;
        }
    } else {
        throw new DatabaseModelError('Invalid speedrun level name');
    }
};

playerSchema.methods.setStoryCompleted = function (completed) {
    if (typeof completed === 'boolean') {
        this.storyCompleted = completed;
    } else {
        throw new DatabaseModelError('The provided argument for storyCompleted was not a boolean!');
    }
};

playerSchema.methods.getData = function () {
    return {
        steamId: this.steamId,
        username: this.username,
        speedruns: this.speedruns,
        storyCompleted: this.storyCompleted,
        coop: this.coop,
    };
};

const playerModel = mongoose.model('Player', playerSchema);

module.exports = playerModel;
