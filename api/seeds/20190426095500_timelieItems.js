const { Random } = require('random-js');
const Item = require('../src/factories/timeline/item');

const { dbSchema } = require('../src/constants');

const { item } = dbSchema.timeline;
const { table } = item;

const seed = async () => {
  const random = new Random();
  const rows = [];

  for (let i = 1; i < random.integer(6, 10); i++) {
    const item = await new Item().get();
    rows.push(item);
  }
  return rows;
};

/**
 * Seed with initial timeline items categories
 */
exports.seed = knex => {
  return knex(item.table)
    .del()
    .then(() => {
      return knex(table)
        .returning(Object.values(item.column))
        .insert(seed(table))
        .then(
          values => Object.values(values).forEach(value => console.log(value)),
          error => {
            throw error;
          }
        );
    });
};
