const awilix = require('awilix');
const winston = require('winston');
const container = require('./app');
const port = +process.env.PORT;

require('./error-tracking');

container.register({
  server: awilix.asValue(
    container.cradle.app.listen(port, () => {
      winston.info('NODE_ENV: ' + process.env.NODE_ENV);
      winston.info(`Api listening on port ${container.cradle.server.address().port}!`);
    }),
  ),
  test: awilix.asValue(2),
});

module.exports = container;
