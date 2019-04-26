const Item = require('../../src/factories/timeline/item');
const Category = require('../../src/factories/timeline/category');

const { dbSchema } = require('../constants');

const { category } = dbSchema.timeline;
const { item } = dbSchema.timeline;

/**
 * Database seed provider
 */
exports.dbSeed = table => {
  switch (table) {
    case category.table:
      return new Category().get();
    case item.table:
      return new Item().get();
    default:
      return null;
  }
};
