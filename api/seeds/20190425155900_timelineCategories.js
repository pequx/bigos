const awilix = require('awilix');
const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');
const { LoremIpsumConfig } = require('../src/configs');
const { dbSchema, locale, placeholders, factory } = require('../src/constants');
const { db } = require('../src/db');
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
  factogitry: asValue(factory),
  placeholders: asValue(placeholders),
  FactoryTimelineCategory: asValue(Category),
  Random: asValue(new Random()),
  LoremIpsum: asValue(new LoremIpsum(LoremIpsumConfig)),
});

container.register({ validator: asValue(require('../src/utils/validator')(container)) });

/**
 * Seed with initial timeline categories
 */
exports.seed = knex => {
  try {
    const { dbSchema, validator, FactoryTimelineCategory } = container.cradle;
    const { timeline } = dbSchema;

    return knex(timeline.category.table)
      .del()
      .then(
        async () =>
          await knex(timeline.category.table)
            .returning(Object.values(timeline.category.column))
            .insert(await new FactoryTimelineCategory(container).select().get('mock'))
            .then(
              rows =>
                validator.env.local
                  ? Object.values(rows).forEach(current =>
                      console.log('Seeding timeline category', current),
                    )
                  : null,
              error => {
                throw error;
              },
            ),
      );
  } catch (error) {
    console.error('Timeline category seeding', error);
  }
};
