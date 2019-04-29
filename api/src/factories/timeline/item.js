const _ = require('lodash');
const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');

const { db } = require('../../db');
const { dbSchema, locale, placeholders, factory } = require('../../../src/constants');
const { LoremIpsumConfig } = require('../../configs');
const { validator } = require('../../../src/factories/validator');

const { timeline } = dbSchema;
const { table } = timeline.item;
const { column } = timeline.item;

const random = new Random();
const lorem = new LoremIpsum(LoremIpsumConfig);

/**
 * Item category provider.
 */
const category = async () => {
  const { category } = timeline;
  const { table } = category;
  const { column } = category;
  return await db(table)
    .select(column.id)
    .where(column.active, true)
    .orderBy(column.id)
    .then(
      rows => _.map(rows, row => row[column.id]),
      error => {
        throw error;
      },
    )
    .catch(error => {
      console.error('Item mock values provider error', error);
      return false;
    });
};

/**
 * Timeline item entities factory.
 */
module.exports = class Item {
  /**
   * @param {Array|Boolean} ids - ids of item entities
   */
  constructor(ids = false) {
    try {
      this.items = {
        ids: validator.timeline.item.ids(ids),
        rows: false,
        criteria: false,
      };
      this.mocks = {
        count: random.integer(6, 10),
        rows: false,
      };
    } catch (error) {
      console.log(`Item provider error`, error);
      return false;
    }
  }

  /**
   * Item entities provider.
   * @param {String|Boolean} criteria - column name selector for ids provided in the constructor.
   */
  async get(criteria) {
    try {
      this.items.criteria = validator.timeline.item.criteria(criteria);
      if (await this._getItems()) {
        const { ids, rows } = this.items;
        return validator.timeline.item.single(ids) ? rows[0] : rows;
      }
      if (await this._getMocks()) {
        return this.mocks.rows;
      }
    } catch (error) {
      console.log(`Item provider error`, error);
      return false;
    }
  }

  /**
   * Items provider.
   * @private
   */
  async _getItems() {
    const { criteria, ids } = this.items;
    try {
      return ids
        ? await db(table)
            .select(Object.values(column))
            .whereIn(
              criteria ? criteria : column.id,
              ids === factory.all ? await this._selectAllItems() : ids,
            )
            .orderBy(column.start)
            .then(
              rows => this._set(rows),
              error => {
                throw error;
              },
            )
        : ids;
    } catch (error) {
      console.error(`Items provider error: ${error}`);
      return false;
    }
  }

  /**
   * Active items selector.
   * @param {Object|boolean} criteria
   * @private
   */
  async _selectAllItems(criteria = false) {
    const { ids } = this.items;
    try {
      return ids === factory.all
        ? db(table)
            .select(column.id)
            .where(column.active, true)
            .orderBy(column.start)
            .then(
              rows => {
                if (validator.env.local) {
                  console.log(`Processed item ids: ${JSON.stringify(rows)}`);
                }
                return _.isArray(rows) ? Object.values(rows).map(row => row[column.id]) : false;
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
  async _getMocks() {
    if (validator.env.local && !this.items.ids) {
      try {
        this.mocks.rows = [];
        while (this.mocks.count >= 1) {
          this.mocks.rows.push({
            [column.active]: true,
            [column.category]: Math.trunc(random.sample(await category(), 1)),
            [column.content]: JSON.stringify(
              Object.values(locale).map(current => ({
                [current]: `<img src="${
                  placeholders.imageTimelineItem
                }" alt="${lorem.generateSentences(1)}"`,
              })),
            ),
            [column.start]: random.date(new Date('2000-09-13T03:24:17'), new Date(Date.now())),
          });
          this.mocks.count -= 1;
        }
        return this.mocks.rows.length > 0 ? true : false;
      } catch (error) {
        console.error(`Item mocks provider error: ${error}`);
        return false;
      }
    }
    return false;
  }

  /**
   * Collected item entities setter.
   * @param {array} rows
   * @private
   */
  _set(rows) {
    this.items.rows = validator.timeline.item.row(rows);
    if (validator.env.local) {
      console.log(`Setting rows: ${JSON.stringify(this.items.rows)}`);
    }
    return this.items.rows ? true : false;
  }
};
