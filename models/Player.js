const mongoose = require('mongoose');
const DatabaseModelError = require('./DatabaseModelError');

const SPEEDRUN_LEVELS = ['TheCrossing', 'Surrounded', 'NewAcquaintance', 'Prisoned', 'DarkForest'];
const COOP_STAT_FIELDS = ['kills', 'headshots', 'maxWave', 'score', 'gamesPlayed'];
const SKINS = ['gold', 'color'];

const playerSchema = new mongoose.Schema({
    steamId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    storyCompleted: {
        type: Boolean,
        default: false,
    },
    speedruns: {
        TheCrossing: {
            type: Number,
            default: 0,
        },
        Surrounded: {
            type: Number,
            default: 0,
        },
        NewAcquaintance: {
            type: Number,
            default: 0,
        },
        Prisoned: {
            type: Number,
            default: 0,
        },
        DarkForest: {
            type: Number,
            default: 0,
        },
    },
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
    skins: {
        type: [String],
        enum: SKINS,
        default: [],
    },
});

playerSchema.methods.setSteamId = function (steamId) {
    if (steamId && steamId.trim().length > 0) {
        this.steamId = steamId;
    }
};

playerSchema.methods.setUsername = function (username) {
    if (username && username.trim().length > 0) {
        if (!this.username || this.username !== username) {
            this.username = username;
        }
    }
};

playerSchema.methods.updateScore = function (score) {
    if (score > 0) {
        this.score += score;
    }
};

playerSchema.methods.setScore = function (score) {
    if (score > 0) {
        this.score = score;
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
        if (this.speedruns[level] === 0 || this.speedruns[level] > time) {
            this.speedruns[level] = time;
            return true;
        }
        return false;
    } else {
        throw new DatabaseModelError('Invalid speedrun level name');
    }
};

playerSchema.methods.setSkin = function (skin) {
    if (SKINS.includes(skin)) {
        if (!this.skins.includes(skin)) {
            this.skins.push(skin);
            return true;
        }
        return false;
    } else {
        throw new DatabaseModelError('Invalid skin name');
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
        skins: this.skins,
    };
};

playerSchema.methods.getCoopData = function () {
    return {
        steamId: this.steamId,
        username: this.username,
        kills: this.coop.kills,
        headshots: this.coop.headshots,
        maxWave: this.coop.maxWave,
        score: this.coop.score,
        gamesPlayed: this.coop.gamesPlayed,
    };
};

playerSchema.statics.getSpeedrunLevels = function () {
    return SPEEDRUN_LEVELS;
};

playerSchema.statics.getCoopStatFields = function () {
    return COOP_STAT_FIELDS;
};

const playerModel = mongoose.model('Player', playerSchema);

module.exports = playerModel;
