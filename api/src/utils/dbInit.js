const Item = require('../../src/factories/timeline/item');
const Category = require('../../src/factories/timeline/category');

const { dbSchema } = require('../constants');

const { category } = dbSchema.timeline;
const { item } = dbSchema.timeline;

const local = process.env.NODE_ENV === 'local';

/**
 * Database seed provider
 */
exports.dbSeed = async table => {
  const info = (table, result) => {
    console.log(`Seed for ${table} recived: ${JSON.stringify(result)}`);
  };
  let result = false;
  switch (table) {
    case category.table:
      result = await new Category().get();
      if (local) {
        info(category.table, result);
      }
      return result;
    case item.table:
      result = await new Item().get();
      if (local) {
        info(item.table, result);
      }
      return result;
    default:
      return result;
  }
};
