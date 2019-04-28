const awilix = require('awilix');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const { apiErrorHandler } = require('./utils/errors');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  app: awilix.asValue(app.use(helmet())),
  api: awilix.asValue(express.Router()),
});

/**
 * Security HTTP headers
 * See https://helmetjs.github.io/docs/
 */
// app.use(helmet());

/**
 * Init
 */
// app.use(cors());
container.cradle.app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
container.cradle.app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
container.cradle.app.use(bodyParser.json());

/**
 * Session handling
 */
require('./sessions')(container.cradle.app);

/**
 * Routes
 */
require('./routes/healthz')(container.cradle.app);
require('./routes/robots')(container.cradle.app);
require('./routes/index')(container.cradle.app);

/**
 * API routes
 */
// const api = express.Router();

require('./routes/account')(container.cradle.api);
require('./routes/products')(container.cradle.api);
require('./routes/timeline')(container);

/**
 * API
 */
container.cradle.api.use(apiErrorHandler);
container.cradle.app.use('/api', container.cradle.api);

module.exports = container;
