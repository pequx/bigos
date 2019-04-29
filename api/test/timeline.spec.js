const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');
const _ = require('lodash');

const { initResources, fetch, closeResources } = require('./utils');

const { db } = require('../src/db');
const { dbSchema } = require('../src/constants');
const { LoremIpsumConfig } = require('../src/configs');

const { timeline } = dbSchema;

const local = process.env.NODE_ENV === 'local';

describe('Timeline', () => {
  beforeAll(initResources);
  /**
   * Categories
   */
  it('Timeline categories should return: a JSON with status OK and result consistent with the schema and data values', async () => {
    const { table } = timeline.category;
    const { column } = timeline.category;
    const random = new Random();
    const sample = random.integer(2, 3);
    const population = await db(table)
      .select(Object.values(column))
      .where(column.active, true)
      .limit(sample + 1)
      .offset(0)
      .orderBy(column.id)
      .then(
        rows => _.sortBy(random.sample(rows, sample), [column.id]),
        error => {
          throw error;
        },
      )
      .catch(error => console.error(error));
    if (local) {
      console.log(
        `Selected ${sample} timeline categories for testing: ${JSON.stringify(population)}`,
      );
    }
    const ids = population.map(row => row[column.id]).join(',');
    const res = await fetch(`/api/timeline/category/${ids}`);
    expect(res.status).toEqual(200);
    const result = JSON.stringify(await res.json());
    if (local) {
      console.log(`JSON response result: ${result}`);
    }
    expect(result).toEqual(JSON.stringify(population));
  });

  /**
   * Items
   */
  it('Timeline items should return: a JSON with status OK and result consistent with the schema and data values', async () => {
    const { table } = timeline.item;
    const { column } = timeline.item;
    try {
      /**
       * @todo wrap it
       */
      const random = new Random();
      const lorem = new LoremIpsum(LoremIpsumConfig);
      const sample = random.integer(3, 5);
      const population = {
        multi: await db(table)
          .select(Object.values(column))
          .where(column.active, true)
          .limit(sample)
          .offset(0)
          .orderBy(column.start)
          .then(
            rows => _.sortBy(random.sample(rows, sample), column.start),
            error => {
              throw error;
            },
          )
          .catch(error => console.error(error)),
        single: await db(table)
          .first(Object.values(column))
          .where(column.active, true)
          .then(
            rows => rows,
            error => {
              throw error;
            },
          )
          .catch(error => console.error(error)),
        all: await db(table)
          .select(Object.values(column))
          .where(column.active, true)
          .orderBy(column.start)
          .then(
            rows => rows,
            error => {
              throw error;
            },
          )
          .catch(error => console.error(error)),
        category: await db(table)
          .select(Object.values(column))
          .where(column.active, true)
          .orderBy(column.start)
          .then(
            rows => rows,
            error => {
              throw error;
            },
          )
          .catch(error => console.error(error)),
      };
      if (local) {
        console.log(`Selected ${sample} timeline items for testing: ${JSON.stringify(population)}`);
      }
      const ids = {
        multi: population.multi.map(row => row[column.id]).join(','),
        single: population.single[column.id],
        all: population.all.map(row => row[column.id]).join(','),
        category: _.sortedUniq(population.category.map(row => row[column.category])).join(','),
        invalid: [
          0,
          -1,
          'all',
          _.camelCase(lorem.generateSentences(1)),
          Math.random()
            .toString(36)
            .substring(1),
        ],
      };
      if (local) {
        console.log(`Collected following ids: ${JSON.stringify(ids)}`);
      }
      const result = {
        multi: {
          valid: await fetch(`/api/timeline/item/${ids.multi}`),
          invalid: await fetch(`/api/timeline/item/${ids.invalid.join(',')}`),
        },
        single: {
          valid: await fetch(`/api/timeline/item/${ids.single}`),
          invalid: await fetch(`/api/timeline/item/${random.sample(ids.invalid, 1)}`),
        },
        all: {
          valid: await fetch(`/api/timeline/item/all`),
          invalid: await fetch(`/api/timeline/item/all${random.sample(ids.invalid, 1)}`),
        },
        category: {
          valid: await fetch(`/api/timeline/item/category/${ids.category}`),
          invalid: await fetch(`/api/timeline/item/category/${random.sample(ids.invalid, 1)}`),
        },
      };
      await Object.keys(result).forEach(async responses => {
        await Object.keys(result[responses]).forEach(async current => {
          if (current === 'valid') {
            const response = result[responses][current];
            expect(response.status).toEqual(200);
            expect(JSON.stringify(await response.json())).toEqual(
              JSON.stringify(population[responses]),
            );
          } else {
            const response = result[responses][current];
            expect(response.status).toEqual(200);
            expect(JSON.stringify(await response.json())).toEqual(JSON.stringify(false));
          }
          // if (current === 'single') {
          // await Object.keys(ids.invalid).forEach(async variant => {
          //   const response = result[responses][current][variant];
          //   expect(response.status).toEqual(200);
          //   expect(JSON.stringify(await response.json())).toEqual(JSON.stringify(false));
          //   });
          // } else {
          // const response = result[responses][current];
          // console.log('o kurwa ziom', response);
          // expect(response.status).toEqual(200);
          // expect(JSON.stringify(await response.json())).toEqual(JSON.stringify(false));
          // }
          // const json = await result[responses][current].json();
          if (local) {
            console.log(`Testing response for ${JSON.stringify(responses)}`);
          }
          // current === 'valid'
          //   ? expect(JSON.stringify(json)).toEqual(JSON.stringify(population[current]))
          //   : expect(JSON.stringify(json)).toEqual(JSON.stringify(false));
        });
      });
    } catch (error) {
      console.error('Timeline item test error:', error);
    }
  });
  afterAll(closeResources);
});
