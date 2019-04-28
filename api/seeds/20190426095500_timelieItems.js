const { dbSchema } = require('../src/constants');
const { dbSeed } = require('../src/utils/dbInit');

const { item } = dbSchema.timeline;
const { table } = item;

const local = process.env.NODE_ENV === 'local';

/**
 * Seed with initial timeline items
 */
exports.seed = knex => {
  return knex(item.table)
    .del()
    .then(async () => {
      return await knex(table)
        .returning(Object.values(item.column))
        .insert(await dbSeed(table))
        .then(
          rows =>
            local
              ? Object.values(rows).forEach(row =>
                  console.log(`Seeding timeline item: ${JSON.stringify(row)}`),
                )
              : null,
          error => {
            throw error;
          },
        );
    });
};
