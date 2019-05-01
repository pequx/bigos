const awilix = require('awilix');
const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');
const { LoremIpsumConfig } = require('../src/configs');
const { dbSchema, locale, placeholders } = require('../src/constants');
const { db } = require('../src/db');
const { category } = dbSchema.timeline;
const { table } = category;
const Category = require('../src/factories/timeline/category');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

const { asValue } = awilix;
container.register({
  _: asValue(require('lodash')),
  db: asValue(db),
  dbSchema: asValue(dbSchema),
  locale: asValue(locale),
  placeholders: asValue(placeholders),
  FactoryTimelineCategory: asValue(Category),
  Random: asValue(new Random()),
  LoremIpsum: asValue(new LoremIpsum(LoremIpsumConfig)),
});

container.register({ validator: asValue(require('../src/utils/validator')(container)) });

/**
 * Seed with initial timeline categories
 */
exports.seed = async knex => {
  return await knex(category.table)
    .del()
    .then(async () => {
      const { validator, FactoryTimelineCategory } = container.cradle;

      return await knex(table)
        .returning(Object.values(category.column))
        .insert(await new FactoryTimelineCategory(container).select().get('mock'))
        .then(
          rows =>
            validator.env.local
              ? Object.values(rows).forEach(current =>
                  console.log('Seeding timeline category', JSON.stringify(current)),
                )
              : null,
          error => {
            throw error;
          },
        );
    })
    .catch(error => console.error('Timeline categories seeeding', error));
};
