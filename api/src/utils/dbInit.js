const { dbSchema, locale } = require('../constants');

const { category } = dbSchema.timeline;
const { column } = category;

/**
 * Database seed provider
 */
exports.dbSeed = table => {
  switch (table) {
    case category.table:
      return [
        {
          [column.active]: true,
          [column.name]: {
            [locale.english]: 'Category 0',
            [locale.german]: 'Kategorie 0'
          },
          [column.description]: {
            [locale.english]: 'Category 0 description',
            [locale.german]: 'Kategorie 0 description'
          }
        },
        {
          [column.active]: true,
          [column.name]: {
            [locale.english]: 'Category 1',
            [locale.german]: 'Kategorie 1'
          },
          [column.description]: {
            [locale.english]: 'Category 1 description',
            [locale.german]: 'Kategorie 1 description'
          }
        }
      ];
    default:
      return null;
  }
};

/**
 * Transaction results handler
 */
exports.result = async ({ values = false, error = false }) => {
  if (!error && values) {
    Array.isArray(values)
      ? Object.values(values).forEach((value, index) =>
          console.log(`Database init, processed ${value} with index ${index}`)
        )
      : console.log(`Database init, processed value ${values}`);
  }
  throw error;
};
