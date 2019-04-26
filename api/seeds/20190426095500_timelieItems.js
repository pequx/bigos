const { dbSchema } = require('../src/constants');
const { dbSeed } = require('../src/utils/dbInit');

const { item } = dbSchema.timeline;
const { table } = item;

/**
 * Seed with initial timeline items
 */
exports.seed = knex => {
  return knex(item.table)
    .del()
    .then(() => {
      return knex(table)
        .returning(Object.values(item.column))
        .insert(dbSeed(table))
        .then(
          values => Object.values(values).forEach(value => console.log(value)),
          error => {
            throw error;
          }
        );
    });
};
