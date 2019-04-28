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
 * Mock data values provider.
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
    console.error(`Category mock values provider error: ${error}`);
  }
};

/**
 * Timeline cateogry entities factory.
 */
module.exports = class Category {
  /**
   * @param {array|boolean} ids - ids of category etntities
   */
  constructor(ids = false) {
    this.categories = {
      ids: ids && ids.length > 0 ? ids : false,
      rows: false,
    };
    this.mocks = {
      count: 6,
      rows: false,
    };
  }

  /**
   * Category entities provider.
   */
  async get() {
    if (await this._getCategories()) {
      return this.categories.rows;
    }
    if (this._getMocks()) {
      return this.mocks.rows;
    }
  }

  /**
   * Collected category entities setter.
   * @param {array} rows
   * @private
   */
  _set(rows) {
    if (rows.length > 0) {
      this.categories.rows = rows;
      if (local) {
        console.log(`Set rows: ${JSON.stringify(this.categories.rows)}`);
      }
      return true;
    }
    return false;
  }

  /**
   * Categories provider.
   * @private
   */
  async _getCategories() {
    const { ids } = this.categories;

    try {
      return ids
        ? await db(table)
            .select(Object.values(column))
            .whereIn(column.id, ids === factory.all ? await this._selectAllCategories() : ids)
            .then(
              rows => this._set(rows),
              error => {
                throw error;
              },
            )
        : false;
    } catch (error) {
      console.error(`Categories provider error: ${error}`);
      return false;
    }
  }

  /**
   * Active categories selector.
   * @private
   */
  async _selectAllCategories() {
    const { ids } = this.categories;
    try {
      return ids[0] === factory.all
        ? db(table)
            .select(column.id)
            .where(column.active, true)
            .then(
              rows => {
                if (local) {
                  console.log(`Processed category ids: ${JSON.stringify(rows)}`);
                }
                return rows.length > 0 ? Object.values(rows).map(row => row[column.id]) : false;
              },
              error => {
                throw error;
              },
            )
        : false;
    } catch (error) {
      console.error(`Category selector error: ${error}`);
      return false;
    }
  }

  /**
   * Category mocks provider.
   * @private
   */
  _getMocks() {
    if (local && !this.categories.ids) {
      try {
        this.mocks.rows = [];
        for (let i = 0; i < this.mocks.count; i += 1) {
          let row = {};
          console.info(`Generating category mock #${i}`);
          Object.values(column).forEach(current => {
            if (current !== column.id) {
              row[current] = value(current);
            }
          });
          this.mocks.rows.push(row);
          console.info(`Pushed row: ${JSON.stringify(row)}}`);
          row = {};
          console.log(`Row #${i} purged`);
        }
        return this.mocks.rows.length > 0 ? true : false;
      } catch (error) {
        console.error(`Category mocks provider error: ${error}`);
        return false;
      }
    }
    return false;
  }
};
