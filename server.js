const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { VIRTUAL_PORT = 3000, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Player = require('./models/Player');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Speedrun API router
const speedrunApi = require('./routes/api/speedrun');
app.use('/api/speedrun', speedrunApi);

// Coop API router
const coopApi = require('./routes/api/coop');
app.use('/api/coop', coopApi);

// Save API router
const saveApi = require('./routes/api/save');
app.use('/api/save', saveApi);

/** -------------------- Handle all other requests with 404, not found -------------------- */
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(VIRTUAL_PORT, () => {
    console.log(`listening on ${VIRTUAL_PORT}`);
});
