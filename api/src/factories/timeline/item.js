const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');

const { db } = require('../../db');
const { dbSchema, locale, placeholders } = require('../../../src/constants');
const { LoremIpsumConfig } = require('../../configs');

const { timeline } = dbSchema;
const { table } = timeline.item;
const { column } = timeline.item;

const random = new Random();
const lorem = new LoremIpsum(LoremIpsumConfig);

module.exports = class Item {
  constructor(...ids) {
    this.items = {
      ids: ids.length > 0 ? ids : false,
      rows: false,
    };
    this.mocks = {
      count: random.integer(6, 10),
      rows: false,
    };
  }

  get() {
    this._getItems();
    if (this.items.rows) {
      console.log('selecting items: ' + this.items);
    } else {
      this._getMocks();
    }
    if (this.mocks.rows) {
      console.log('mocks: ' + this.mocks.rows);
    }
    console.log(this.items.rows);
    return this.items.rows.length ? this.items.rows : this.mocks.rows;
  }

  /**
   * @private
   */
  _getItems() {
    try {
      return this.items.ids
        ? db(table)
            .select(Object.values(column))
            .whereIn(column.id, this.items.ids)
            .then(
              rows => {
                this.items.rows = rows;
                return this.items.rows.length > 0 ? true : false;
              },
              error => console.error(error),
            )
        : false;
    } catch (error) {
      console.error(`error ${error}`);
    }
  }

  /**
   * @private
   */
  _getMocks() {
    this.mocks.rows = [];
    const image = JSON.stringify(
      Object.values(locale).map(locale => ({
        [locale]: `<img src="${placeholders.imageTimelineItem}" alt="${lorem.generateSentences(
          1,
        )}"`,
      })),
    );
    const value = current => {
      console.log('switch current: ' + current);
      switch (current) {
        case column.active:
          return true;
        case column.category:
          return random.integer(1, 2);
        case column.content:
          return JSON.stringify(image);
        case column.start:
          return random.date(new Date('2000-09-13T03:24:17'), new Date(Date.now()));
        default:
          return null;
      }
    };

    for (let i = 0; i < this.mocks.count; i++) {
      console.log('mock nr.: ' + i);
      const row = {};
      Object.values(column).forEach(current => {
        if (current !== column.id) {
          row[current] = value(current);
          console.log(row);
        }
      });
      this.mocks.rows.push(row);
    }

    return this.mocks.rows.length > 0 ? true : false;
  }
};
