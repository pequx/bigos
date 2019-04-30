/**
 * Item category provider.
 */
const category = async (container = false) => {
  try {
    if (container instanceof Object) {
      const { _, db, dbSchema } = container.cradle;
      const { category } = dbSchema.timeline;
      const { table, column } = category;

      return await db(table)
        .select(column.id)
        .where(column.active, true)
        .orderBy(column.id)
        .then(
          rows => _.map(rows, current => current[column.id]),
          error => {
            throw error;
          },
        )
        .catch(error => {
          console.error('Item mock values provider error', error);
          return false;
        });
    }
  } catch (error) {
    console.error('Item category provider error', error);
  }
  return false;
};

/**
 * Timeline item entities factory.
 */
module.exports = class Item {
  /**
   * @param {Object|Boolean} - awilix container
   */
  constructor(container = false) {
    /**
     * @private
     */
    this._container = false;
    this._items = {
      ids: false,
      rows: false,
      criteria: false,
    };
    this._mocks = {
      count: 10,
      rows: false,
    };

    try {
      if (container instanceof Object) {
        this._container = container;
      }
    } catch (error) {
      console.error(`Container loading error`, error);
    }
  }

  /**
   * Items over ids selector.
   * @param {Array|Boolean} - selected item ids
   */
  select(ids = false) {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;
        this._items.ids = validator.timeline.item.id(ids);
      }
    } catch (error) {
      console.error(`Item selector error`, error);
    }
    return this;
  }

  /**
   * Item entities provider.
   * @param {String|Boolean} criteria - column name selector for ids provided in the constructor.
   */
  async get(criteria = false) {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;
        this._items.criteria = validator.timeline.item.criteria(criteria);
        if (await this._getItems()) {
          const { ids, rows } = this._items;
          return validator.timeline.item.single(ids) ? rows[0] : rows;
        }
        if (await this._getMocks()) {
          return this._mocks.rows;
        }
      }
    } catch (error) {
      console.error(`Item provider`, error);
      return false;
    }
  }

  /**
   * Items provider.
   * @private
   */
  async _getItems() {
    try {
      if (this._container instanceof Object) {
        const { criteria, ids } = this._items;
        const { dbSchema } = this._container.cradle;
        const { table, column } = dbSchema.timeline.item;
        return ids
          ? await this._container.cradle
              .db(table)
              .select(Object.values(column))
              .whereIn(
                criteria ? criteria : column.id,
                ids === 'all' ? await this._selectAllItems() : ids,
              )
              .orderBy(column.start)
              .then(
                rows => (this._set(rows) ? true : false),
                error => {
                  throw error;
                },
              )
          : ids;
      }
    } catch (error) {
      console.error(`Items provider error: ${error}`);
    }
    return false;
  }

  /**
   * Active items selector.
   * @private
   */
  async _selectAllItems() {
    try {
      if (this._container instanceof Object) {
        const { ids } = this._items;
        const { _, dbSchema, validator } = this._container.cradle;
        const { table, column } = dbSchema.timeline.item;

        return ids === 'all'
          ? this._container.cradle
              .db(table)
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
      }
    } catch (error) {
      console.error(`Items selector error: ${error}`);
    }
    return false;
  }

  /**
   * Item mocks provider.
   * @private
   */
  async _getMocks() {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;
        const { dbSchema, locale, placeholders, Random, LoremIpsum } = this._container.cradle;
        const { column } = dbSchema.timeline.item;

        if (validator.env.local && !this._items.ids) {
          this._mocks.rows = [];
          while (this._mocks.count >= 1) {
            this._mocks.rows.push({
              [column.active]: true,
              [column.category]: Math.trunc(Random.sample(await category(this._container), 1)),
              [column.content]: JSON.stringify(
                Object.values(locale).map(current => ({
                  [current]: `<img src="${
                    placeholders.imageTimelineItem
                  }" alt="${LoremIpsum.generateSentences(1)}"`,
                })),
              ),
              [column.start]: Random.date(new Date('2000-09-13T03:24:17'), new Date(Date.now())),
            });
            this._mocks.count -= 1;
          }
          return this._mocks.rows.length > 0 ? true : false;
        }
      }
    } catch (error) {
      console.error('Item mocks provider error', error);
    }
    return false;
  }

  /**
   * Collected item entities setter.
   * @param {array} rows
   * @private
   */
  _set(rows) {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;
        this._items.rows = validator.timeline.item.row(rows);
        if (validator.env.local) {
          console.log(`Setting rows: ${JSON.stringify(this._items.rows)}`);
        }
        return this._items.rows ? true : false;
      }
    } catch (error) {
      console.error('Items provider error', error);
    }
    return false;
  }
};
