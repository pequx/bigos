const { Random } = require('random-js');
const { LoremIpsum } = require('lorem-ipsum');

const { db } = require('../../db');
const { dbSchema, locale, placeholders } = require('../../../src/constants');
const { LoremIpsumConfig } = require('../../configs');

const { timeline } = dbSchema;
const { table } = timeline.item;
const { column } = timeline.item;

module.exports = class Item {
  constructor(...ids) {
    this.ids = ids.length > 0 ? ids : false;
    this.items = false;
    this.mocks = false;
  }

  async get() {
    // this.ids ? this._getItems() : this._getMocks();
    this.items = await this._getItems();
    console.log('items' + this.items);
    this.mocks = this._getMocks();
    console.log('mocks' + this.mocks);
    return this.items ? this.items : this._getMocks();
  }

  /**
   * @private
   */
  async _getItems() {
    try {
      return await db(table)
        .select(Object.values(column))
        .whereIn(column.id, this.ids)
        .then(
          rows => {
            return rows;
          },
          error => console.error(error)
        );
    } catch (error) {
      return console.error(`error ${error}`);
    }
  }

  /**
   * @private
   */
  _getMocks() {
    const lorem = new LoremIpsum(LoremIpsumConfig);

    const rows = [];
    Object.values(column).forEach(current => {
      if (current !== column.id) {
        const random = new Random();
        const image = JSON.stringify(
          Object.values(locale).map(locale => ({
            [locale]: `<img src="${placeholders.imageTimelineItem}" alt="${lorem.generateSentences(
              1
            )}"`
          }))
        );
        // console.log(ja);

        const value = () => {
          switch (current) {
            case column.active:
              return true;
            case column.category:
              return random.integer(0, 1);
            case column.content:
              return JSON.stringify(image);
            case column.start:
              return random.date(new Date('2000-09-13T03:24:17'), new Date(Date.now()));
            default:
              return null;
          }
        };

        rows.push(value());
      }
    });
    console.log('rows: ' + rows);
    return rows;
  }
};
