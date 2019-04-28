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
    .then(async () => {
      return await knex(table)
        .returning(Object.values(category.column))
        .insert(await dbSeed(table))
        .then(
          rows =>
            local
              ? Object.values(rows).forEach(row =>
                  console.log(`Seeding timeline category: ${JSON.stringify(row)}`),
                )
              : null,
          error => {
            throw error;
          },
        );
    })
    .catch(error => console.error(`Categories seeeding error: ${error}`));
};
