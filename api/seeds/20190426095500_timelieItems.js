const { dbSchema } = require('../src/constants');

const { item } = dbSchema.timeline;
const { table } = item;

const local = process.env.NODE_ENV === 'local';

const Item = require('../src/factories/timeline/item');

/**
 * Seed with initial timeline items
 */
exports.seed = async knex => {
  return await knex(item.table)
    .del()
    .then(async () => {
      return await knex(table)
        .returning(Object.values(item.column))
        .insert(await new Item().get())
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
