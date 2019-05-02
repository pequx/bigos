const awilix = require('awilix');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');
const { LoremIpsumConfig } = require('../src/configs');
const { apiErrorHandler } = require('./utils/errors');
const { db } = require('../src/db');
const { dbSchema, locale } = require('../src/constants');

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
  api: asValue(express.Router()),
  db: asValue(db),
  dbSchema: asValue(dbSchema),
  locale: asValue(locale),
  RouterTimelineCategory: asValue(express.Router()),
  RouterTimelineItem: asValue(express.Router()),
  FactoryTimelineCategory: asValue(require('../src/factories/timeline/category')),
  FactoryTimelineItem: asValue(require('../src/factories/timeline/item')),
  session: asValue(require('express-session')),
  Random: asValue(new Random()),
  LoremIpsum: asValue(new LoremIpsum(LoremIpsumConfig)),
});

const { app, api, session } = container.cradle;

container.register({ validator: asValue(require('../src/utils/validator')(container)) });

/**
 * Session handling
 * @todo solve this in a more elegant way
 */
container.register({ RedisStore: asValue(require('connect-redis')(session)) });
require('./sessions')(container);

/**
 * Routes
 */
require('./routes/healthz')(app);
require('./routes/robots')(app);
require('./routes/index')(app);

/**
 * API
 */
api.use(apiErrorHandler);
app.use('/api', api);

/**
 * API routes
 */
require('./routes/account')(api);
require('./routes/products')(api);
require('./routes/timeline/category')(container);
require('./routes/timeline/item')(container);

module.exports = container;
