const path = require('path');
const express = require('express');
const logger = require('morgan');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');

const workout = require('./api/workout');

const app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());

app.use('/', serveStatic(path.join(__dirname, '..', 'build')));

app.use('/workout', workout.router);
app.get('/reset-table', workout.reset);

module.exports = app;