const { Random } = require('random-js');
const _ = require('lodash');

const { initResources, fetch, closeResources } = require('./utils');

const { db } = require('../src/db');
const { dbSchema } = require('../src/constants');

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
      };
      if (local) {
        console.log(`Collected following ids: ${JSON.stringify(ids)}`);
      }
      const res = {
        multi: await fetch(`/api/timeline/item/${ids.multi}`),
        single: await fetch(`/api/timeline/item/${ids.single}`),
        all: await fetch(`/api/timeline/item/all`),
        category: await fetch(`/api/timeline/item/category/${ids.category}`),
      };
      Object.keys(res).forEach(async current => {
        const json = await res[current].json();
        if (local) {
          console.log(`Testing response for ${JSON.stringify(current)}: ${JSON.stringify(json)}`);
        }
        expect(res[current].status).toEqual(200);
        expect(JSON.stringify(json)).toEqual(JSON.stringify(population[current]));
      });
    } catch (error) {
      console.error('Timeline item test error:', error);
    }
  });
  afterAll(closeResources);
});
