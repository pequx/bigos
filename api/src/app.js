const awilix = require('awilix');
const { Random } = require('random-js');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const { apiErrorHandler } = require('./utils/errors');
const { db } = require('../src/db');
const { validator } = require('../src/utils/validator');
const { dbSchema, locale } = require('../src/constants');

const Category = require('../src/factories/timeline/category');
const Item = require('../src/factories/timeline/item');

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
  _: asValue(require('lodash')),
  api: asValue(express.Router().use(apiErrorHandler)),
  Router: asValue(express.Router()),
  db: asValue(db),
  dbSchema: asValue(dbSchema),
  validator: asValue(validator),
  locale: asValue(locale),
  FactoryTimelineItem: asValue(Item),
  FactoryTimelineCategory: asValue(Category),
  Random: asValue(new Random()),
  session: asValue(require('express-session')),
});

const { app, api, session } = container.cradle;

/**
 * Session handling
 * @todo solve this in a more elegant way
 */
container.register({
  RedisStore: asValue(require('connect-redis')(session)),
});
require('./sessions')(container);

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
