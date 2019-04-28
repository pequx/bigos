const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const { apiErrorHandler } = require('./utils/errors');

/**
 * Security HTTP headers
 * See https://helmetjs.github.io/docs/
 */
app.use(helmet());

/**
 * Init
 */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Session handling
 */
require('./sessions')(app);

/**
 * Routes
 */
require('./routes/healthz')(app);
require('./routes/robots')(app);
require('./routes/index')(app);

/**
 * API routes
 */
const api = express.Router();
require('./routes/account')(api);
require('./routes/products')(api);
require('./routes/timeline/category')(api);
require('./routes/timeline/item')(api);

/**
 * API
 */
api.use(apiErrorHandler);
app.use('/api', api);

module.exports = app;
