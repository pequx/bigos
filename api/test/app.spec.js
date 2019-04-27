const { Random } = require('random-js');

const { initResources, fetch, integration, appUnit, closeResources } = require('./utils');

const { db } = require('../src/db');
const { dbSchema } = require('../src/constants');

const { timeline } = dbSchema;

const local = process.env.NODE_ENV === 'local';

describe('App', () => {
  beforeAll(initResources);

  it('Home page should return a message', async () => {
    const res = await fetch('/');
    expect(res.status).toEqual(200);
    expect(await res.text()).toEqual('<p>Hello Boilerplate</p>');
  });

  it('Timeline category item(s) should return: a JSON with status OK and result consistent with the schema and data values', async () => {
    const { table } = timeline.category;
    const { column } = timeline.category;

    const random = new Random();
    const sample = 3;
    const population = await db(table)
      .select(Object.values(column))
      .where(column.active, true)
      .limit(5)
      .offset(0)
      .then(
        rows => random.sample(rows, sample),
        error => {
          throw error;
        },
      )
      .catch(error => console.error(error));
    local
      ? console.log(`Selected ${sample} categories for testing: ${JSON.stringify(population)}`)
      : null;

    const ids = population.map(row => row[column.id]).join(',');
    const res = await fetch(`/api/timeline/category/${ids}`);

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual(population);
  });

  it('Healthz should return a JSON with status OK', async () => {
    const res = await fetch('/healthz');
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({ status: 'OK' });
  });

  integration('Long healthz should return a JSON with status OK', async () => {
    const res = await fetch(`/healthz/long/${process.env.HEALTH_CHECK_SECRET}`);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({ db: 'OK' });
  });

  appUnit('robots.txt should allow indexing', async () => {
    process.env.ROBOTS_INDEX = 'true';
    const res = await fetch('/robots.txt');
    expect(res.status).toEqual(200);
    expect(await res.text()).toEqual('User-agent: *\nDisallow:\n');
  });

  appUnit('robots.txt should prevent indexing', async () => {
    process.env.ROBOTS_INDEX = 'false';
    const res = await fetch('/robots.txt');
    expect(res.status).toEqual(200);
    expect(await res.text()).toEqual('User-agent: *\nDisallow: /\n');
  });

  afterAll(closeResources);
});
