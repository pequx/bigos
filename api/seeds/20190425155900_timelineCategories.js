const { dbSchema } = require('../src/constants');

const { category } = dbSchema.timeline;
const { table } = category;

const local = process.env.NODE_ENV === 'local';

const Category = require('../src/factories/timeline/category');

/**
 * Seed with initial timeline categories
 */
exports.seed = async knex => {
  return await knex(category.table)
    .del()
    .then(async () => {
      return await knex(table)
        .returning(Object.values(category.column))
        .insert(await new Category().get())
        .then(
          rows =>
            local
              ? Object.values(rows).forEach(row =>
                  console.log(`*** Seeding timeline category: ${JSON.stringify(row)}`),
                )
              : null,
          error => {
            throw error;
          },
        );
    })
    .catch(error => console.error(`Categories seeeding error: ${error}`));
};
