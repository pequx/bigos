const { dbSchema } = require('../src/constants');
const { dbSeed } = require('../src/utils/dbInit');

const { category } = dbSchema.timeline;
const { table } = category;

/**
 * Seed with initial timeline categories
 */
exports.seed = knex => {
  return knex(category.table)
    .del()
    .then(() => {
      return knex(table)
        .returning(Object.values(category.column))
        .insert(dbSeed(table))
        .then(
          values => Object.values(values).forEach(value => console.log(value)),
          error => {
            throw error;
          }
        );
    });
};
