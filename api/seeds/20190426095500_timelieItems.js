const awilix = require('awilix');
const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');
const { LoremIpsumConfig } = require('../src/configs');
const { dbSchema, locale, placeholders } = require('../src/constants');
const { db } = require('../src/db');
const { item } = dbSchema.timeline;
const { table } = item;
const Item = require('../src/factories/timeline/item');

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
  FactoryTimelineItem: asValue(Item),
  Random: asValue(new Random()),
  LoremIpsum: asValue(new LoremIpsum(LoremIpsumConfig)),
});

container.register({ validator: asValue(require('../src/utils/validator')(container)) });

/**
 * Seed with initial timeline items
 */
exports.seed = knex => {
  try {
    const { dbSchema, validator, FactoryTimelineItem } = container.cradle;
    const { timeline } = dbSchema;

    return knex(timeline.item.table)
      .del()
      .then(async () => {
        return await knex(table)
          .returning(Object.values(timeline.item.column))
          .insert(await new FactoryTimelineItem(container).select().get('mock'))
          .then(
            rows =>
              validator.env.local
                ? Object.values(rows).forEach(current =>
                    console.log('Seeding timeline item', current),
                  )
                : null,
            error => {
              throw error;
            },
          );
      });
  } catch (error) {
    console.error('Timeline items seeding', error);
  }
};
