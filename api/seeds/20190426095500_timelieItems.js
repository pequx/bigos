const awilix = require('awilix');
const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');
const { LoremIpsumConfig } = require('../src/configs');
const { validator } = require('../src/utils/validator');
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
  validator: asValue(validator),
  locale: asValue(locale),
  placeholders: asValue(placeholders),
  FactoryTimelineItem: asValue(Item),
  Random: asValue(new Random()),
  LoremIpsum: asValue(new LoremIpsum(LoremIpsumConfig)),
});

/**
 * Seed with initial timeline items
 */
exports.seed = async knex => {
  return await knex(item.table)
    .del()
    .then(async () => {
      return await knex(table)
        .returning(Object.values(item.column))
        .insert(await new Item(container).select().get('all'))
        .then(
          rows =>
            validator.env.local
              ? Object.values(rows).forEach(current =>
                  console.log(`Seeding timeline item: ${JSON.stringify(current)}`),
                )
              : null,
          error => {
            throw error;
          },
        );
    });
};
