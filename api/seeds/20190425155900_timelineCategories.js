const { dbSchema } = require('../src/constants');
const { dbSeed } = require('../src/utils/dbInit');

const { category } = dbSchema.timeline;
const { table } = category;

const local = process.env.NODE_ENV === 'local';

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
          values =>
            local
              ? Object.values(values).forEach(value =>
                  console.log(`Seeding ${JSON.stringify(value)}`),
                )
              : null,
          error => {
            throw error;
          },
        );
    });
};
