const { Random } = require('random-js');
const _ = require('lodash');

const { initResources, fetch, closeResources } = require('./utils');

const { db } = require('../src/db');
const { dbSchema } = require('../src/constants');

const { timeline } = dbSchema;

const local = process.env.NODE_ENV === 'local';

describe('Timeline', () => {
  beforeAll(initResources);

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

  it('Timeline items should return: a JSON with status OK and result consistent with the schema and data values', async () => {
    const { table } = timeline.item;
    const { column } = timeline.item;
    const random = new Random();
    const sample = random.integer(3, 5);
    const population = await db(table)
      .select(Object.values(column))
      .where(column.active, true)
      .limit(sample + 1)
      .offset(0)
      .orderBy(column.start)
      .then(
        rows => _.sortBy(random.sample(rows, sample), [column.start]),
        error => {
          throw error;
        },
      )
      .catch(error => console.error(error));
    if (local) {
      console.log(`Selected ${sample} timeline items for testing: ${JSON.stringify(population)}`);
    }
    const ids = population.map(row => row[column.id]).join(',');
    const res = await fetch(`/api/timeline/item/${ids}`);
    expect(res.status).toEqual(200);
    const result = JSON.stringify(await res.json());
    if (local) {
      console.log(`JSON response result: ${result}`);
    }
    expect(result).toEqual(JSON.stringify(population));
  });

  afterAll(closeResources);
});
