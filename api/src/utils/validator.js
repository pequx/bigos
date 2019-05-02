/**
 * @param {Object|Boolean} container - awilix container
 */
module.exports = (container = false) => {
  try {
    if (container instanceof Object) {
      const { _ } = container.cradle;
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
                0: _.isArray(collection) || _.isString(collection),
                1: !_.includes(collection, 0),
              };
              return condition[0] && condition[1] ? collection : false;
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
            /**
             * Validates item id.
             * @returns {Array|String|Boolean}
             */
            id(collection) {
              const condition = {
                0: _.isArray(collection) || _.isString(collection),
                1: !_.includes(collection, 0),
              };
              return condition[0] && condition[1] ? collection : false;
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
