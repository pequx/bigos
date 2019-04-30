const awilix = require('awilix');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const { apiErrorHandler } = require('./utils/errors');
const { db } = require('../src/db');

const Item = require('../src/factories/timeline/item');

const { validator } = require('../src/utils/validator');
const { dbSchema } = require('../src/constants');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

/**
 * Container
 */
const { asValue } = awilix;
container.register({
  /**
   * Security HTTP headers
   * See https://helmetjs.github.io/docs/
   */
  app: asValue(
    express()
      .use(helmet())
      .use(cors())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(bodyParser.json()),
  ),
  api: asValue(express.Router().use(apiErrorHandler)),
  db: asValue(db),
  dbSchema: asValue(dbSchema),
  FactoryTimelineItem: asValue(Item),
  validator: asValue(validator),
});

const { app, api } = container.cradle;

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
require('./routes/account')(api);
require('./routes/products')(api);
require('./routes/timeline/category')(container);
require('./routes/timeline/item')(container);

/**
 * API
 */
app.use('/api', api);

module.exports = container;
