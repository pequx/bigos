const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');

const { db } = require('../../db');
const { dbSchema, locale, placeholders, factory } = require('../../../src/constants');
const { LoremIpsumConfig } = require('../../configs');

const { timeline } = dbSchema;
const { table } = timeline.item;
const { column } = timeline.item;

const random = new Random();
const lorem = new LoremIpsum(LoremIpsumConfig);

const local = process.env.NODE_ENV === 'local';

/**
 * Mock data values provider.
 * @param {string} current - current column name
 */
const value = current => {
  try {
    console.info(`Generating value for: ${current}`);
    switch (current) {
      case column.active:
        return true;
      case column.category:
        return random.integer(1, 2);
      case column.content:
        return JSON.stringify(
          Object.values(locale).map(current => ({
            [current]: `<img src="${placeholders.imageTimelineItem}" alt="${lorem.generateSentences(
              1,
            )}"`,
          })),
        );
      case column.start:
        return random.date(new Date('2000-09-13T03:24:17'), new Date(Date.now()));
      default:
        return null;
    }
  } catch (error) {
    console.error(`Item mock values provider error: ${error}`);
  }
};

/**
 * Timeline item entities factory.
 */
module.exports = class Item {
  /**
   * @param {array|boolean} ids - ids of item entities
   */
  constructor(ids = false) {
    this.items = {
      ids: ids && ids.length > 0 ? ids : false,
      rows: false,
    };
    this.mocks = {
      count: random.integer(6, 10),
      rows: false,
    };
  }

  /**
   * Item entities provider.
   */
  async get() {
    if (await this._getItems()) {
      return this.items.rows;
    }
    if (this._getMocks()) {
      return this.mocks.rows;
    }
  }

  /**
   * Collected item entities setter.
   * @param {array} rows
   * @private
   */
  _set(rows) {
    if (rows.length > 0) {
      this.items.rows = rows;
      if (local) {
        console.log(`Set rows: ${JSON.stringify(this.items.rows)}`);
      }
      return true;
    }
    return false;
  }

  /**
   * Items provider.
   * @private
   */
  async _getItems() {
    const { ids } = this.items;
    try {
      return ids && ids.length > 0
        ? await db(table)
            .select(Object.values(column))
            .whereIn(column.id, ids === factory.all ? await this._selectAllItems() : ids)
            .orderBy(column.start)
            .then(
              rows => this._set(rows),
              error => {
                throw error;
              },
            )
        : false;
    } catch (error) {
      console.error(`Items provider error: ${error}`);
      return false;
    }
  }

  /**
   * Active items selector.
   * @private
   */
  async _selectAllItems() {
    const { ids } = this.items;
    try {
      return ids === factory.all
        ? db(table)
            .select(column.id)
            .where(column.active, true)
            .orderBy(column.start)
            .then(
              rows => {
                if (local) {
                  console.log(`Processed item ids: ${JSON.stringify(rows)}`);
                }
                return rows.length > 0 ? Object.values(rows).map(row => row[column.id]) : false;
              },
              error => {
                throw error;
              },
            )
        : false;
    } catch (error) {
      console.error(`Items selector error: ${error}`);
      return false;
    }
  }

  /**
   * Item mocks provider.
   * @private
   */
  _getMocks() {
    if (local && !this.items.ids) {
      try {
        this.mocks.rows = [];
        for (let i = 0; i < this.mocks.count; i += 1) {
          let row = {};
          console.info(`Generating item mock #${i}`);
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
        console.error(`Item mocks provider error: ${error}`);
        return false;
      }
    }
    return false;
  }
};
