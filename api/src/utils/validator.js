const _ = require('lodash');

exports.validator = {
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
    item: {
      /**
       * Validates item ids.
       * @returns {Array|String|Boolean}
       */
      ids(collection) {
        const condition = {
          0: _.isArray(collection) || _.isString(collection),
          1: !_.includes(collection, 0),
        };
        return condition[0] && condition[1] ? collection : false;
      },
      /**
       * Validates item single item.
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
