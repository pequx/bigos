/**
 * This way of session handling is not needed if you only do stateless sessions
 * (e.g. using JWT in HTTP headers)
 */

const { REDIS_HOST, REDIS_PORT, REDIS_PREFIX, SESSION_SECRET } = process.env;

/**
 * @param {Object|False} container
 */
module.exports = (container = false) => {
  const { app, session, RedisStore } = container.cradle;
  app.use(
    session({
      store: new RedisStore({
        host: REDIS_HOST,
        port: +REDIS_PORT,
        prefix: `${REDIS_PREFIX}:sess:`,
      }),
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    }),
  );
};
