/**
 * @param {Object|Boolean} container - awilix container
 */
module.exports = (container = false) => {
  try {
    if (container instanceof Object) {
      const { _, factory } = container.cradle;
      return {
        env: {
          local: process.env.NODE_ENV === 'local',
        },
        container(collection) {
          return collection.inspect().match(/AwilixContainer.*\d/g).length > 0 ? collection : false;
        },
        /**
         * Timeline item validators.
         */
        timeline: {
          category: {
            /**
             * Validates item id.
             * @returns {Array|String|Boolean}
             */
            id(collection) {
              const condition = {
                0: collection === factory.all,
                1: _.isArray(collection),
                2: _.every(collection, Number),
                3: !_.includes(collection, 0),
              };
              return condition[0]
                ? collection
                : condition[1] && condition[2] && condition[3]
                ? collection
                : false;
            },
            name(collection) {
              const condition = {
                0: collection === factory.all,
                1: _.isArray(collection),
                2: _.every(collection, String),
              };
              return condition[0] ? collection : condition[1] && condition[2] ? collection : false;
            },
            /**
             * Validates is category a single item.
             * @returns {Boolean}
             */
            single(collection) {
              return _.isArray(collection) && collection.length == 1;
            },
            /**
             * Validates collected category entity.
             * @returns {Array|Boolean}
             */
            row(collection) {
              return _.isArray(collection) ? collection : false;
            },
            /**
             * Validates item selector criteria.
             * @returns {String|Boolean}
             */
            criteria(collection) {
              return _.isString(collection) ? collection : false;
            },
            /**
             * Validates router factory response.
             * @returns {Array|Object|Boolean}
             */
            response(collection) {
              return _.isArray(collection) || _.isObjectLike(collection) ? collection : false;
            },
            /**
             * @returns {Array|Object}
             */
            request(collection) {
              return _.isNumber(collection) ? collection : false;
            },
          },
          item: {
            id(collection) {
              const condition = {
                0: collection === factory.all,
                1: _.isArray(collection),
                2: _.every(collection, Number),
                3: !_.includes(collection, 0),
              };
              return condition[0]
                ? collection
                : condition[1] && condition[2] && condition[3]
                ? collection
                : false;
            },
            name(collection) {
              const condition = {
                0: collection === factory.all,
                1: _.isArray(collection),
                2: _.every(collection, String),
              };
              return condition[0] ? collection : condition[1] && condition[2] ? collection : false;
            },
            /**
             * Validates is item a single item.
             * @returns {Boolean}
             */
            single(collection) {
              return _.isArray(collection) && collection.length == 1;
            },
            /**
             * Validates item selector criteria.
             * @returns {String|Boolean}
             */
            criteria(collection) {
              return _.isString(collection) ? collection : false;
            },
            /**
             * Validates collected item setter row.
             * @returns {Array|Boolean}
             */
            row(collection) {
              return _.isArray(collection) ? collection : false;
            },
            /**
             * Validates router factory response.
             * @returns {Array|Object|Boolean}
             */
            response(collection) {
              return _.isArray(collection) || _.isObjectLike(collection) ? collection : false;
            },
            /**
             * Validates request params ids for item over category selector.
             * @returns {Array|Object}
             */
            request(collection) {
              return _.isNumber(collection) ? collection : false;
            },
          },
        },
      };
    }
  } catch (error) {
    console.error('Validator', error);
  }
};
