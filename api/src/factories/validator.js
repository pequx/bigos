const _ = require('lodash');

exports.validator = {
  env: {
    local: process.env.NODE_ENV === 'local',
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
        return _.isArray(collection) || _.isString(collection) ? collection : false;
      },
      /**
       * Validates item singleton.
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
    },
  },
};
