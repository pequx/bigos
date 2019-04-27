const { LoremIpsum } = require('lorem-ipsum');

const { db } = require('../../db');
const { dbSchema, locale, factory } = require('../../../src/constants');
const { LoremIpsumConfig } = require('../../configs');

const { timeline } = dbSchema;
const { table } = timeline.category;
const { column } = timeline.category;

const local = process.env.NODE_ENV === 'local';
const lorem = new LoremIpsum(LoremIpsumConfig);

/**
 * Generate value for given column.
 * @param {string} current - currnet column name
 */
const value = current => {
  try {
    console.info(`Generating value for: ${current}`);
    const count = {
      category: 1,
    };
    const row = {};
    switch (current) {
      case column.active:
        return true;
      case column.name:
        Object.values(locale).forEach(current => {
          row[current] = `Cat ${count.category} ${lorem.generateWords(3)}`;
        });
        return row;
      case column.description:
        Object.values(locale).forEach(current => {
          row[current] = lorem.generateSentences(2);
        });
        return row;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Category mock value generator error: ${error}`);
  }
};

/**
 * Timeline cateogry entities factory.
 */
module.exports = class Category {
  constructor(...ids) {
    this.categories = {
      ids: ids.length > 0 ? ids : false,
      rows: false,
    };
    this.mocks = {
      count: 6,
      rows: false,
    };
  }

  async get() {
    if (await this._getCategories()) {
      return this.categories.rows;
    }
    if (this._getMocks()) {
      return this.categories.mocks;
    }
  }

  /**
   * Category entity getter.
   * @private
   */
  async _getCategories() {
    const { ids } = this.categories;
    try {
      return ids
        ? db(table)
            .select(Object.values(column))
            .whereIn(column.id, ids ? await this._getAllCategoryIds() : ids)
            .then(
              rows => {
                this.categories.rows = rows;
                local ? console.log(`Processed rows: ${JSON.stringify(rows)}`) : null;
                return this.categories.rows.length > 0 ? true : false;
              },
              error => {
                throw error;
              },
            )
        : false;
    } catch (error) {
      console.error(`Category getter error: ${error}`);
      return false;
    }
  }

  /**
   * Provides all timeline category ids.
   * @private
   */
  async _getAllCategoryIds() {
    const { ids } = this.categories;
    try {
      return ids[0] === factory.all
        ? db(table)
            .select(column.id)
            .where(column.active, true)
            .then(
              rows => {
                local ? console.log(`Processed ids: ${JSON.stringify(rows)}`) : null;
                return rows.length > 0 ? Object.values(rows).map(row => row[column.id]) : false;
              },
              error => {
                throw error;
              },
            )
        : false;
    } catch (error) {
      console.error(`Category ids getter error: ${error}`);
      return false;
    }
  }

  /**
   * Genreate category mocks.
   * @private
   */
  _getMocks() {
    const { ids } = this.categories;
    if (local && !ids) {
      try {
        this.mocks.rows = [];
        for (let i = 0; i < this.mocks.count; i++) {
          console.info(`Generating category mock #${i}`);

          let row = {};
          Object.values(column).forEach(current => {
            if (current !== column.id) {
              row[current] = value(current);
            }
          });
          this.mocks.rows.push(row);
          console.info(`Pushed row: ${JSON.stringify(row)}}`);
          row = {};
          console.info(`Purged`);
        }

        return this.mocks.rows.length > 0 ? true : false;
      } catch (error) {
        console.error(`Category mock generator error: ${error}`);
        return false;
      }
    }
    return false;
  }
};
