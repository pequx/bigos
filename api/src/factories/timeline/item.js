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
    this._container = container;
    this._items = {
      ids: false,
      rows: false,
      criteria: false,
    };
    this._mocks = {
      count: 16,
      rows: false,
    };
  }

  /**
   * Items over ids selector.
   * @param {Array|Boolean} - selected item ids
   */
  select(ids = false) {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;

        this._items.ids = validator.timeline.item.id(ids) || validator.timeline.category.name(ids);
      }
    } catch (error) {
      console.error(`Item ids selector error`, error);
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
          return this._items.rows;
        }
        if (await this._getMocks()) {
          return this._mocks.rows;
        }
      }
    } catch (error) {
      console.error(`Item provider`, error);
    }
    return false;
  }

  /**
   * Items provider.
   * @private
   */
  async _getItems() {
    try {
      if (this._container instanceof Object) {
        const { db, dbSchema, factory } = this._container.cradle;
        const { criteria, ids } = this._items;

        const { timeline } = dbSchema;
        const { table, column } = timeline.item;

        switch (criteria) {
          case column.category:
            return ids
              ? await db(table)
                  .select(Object.values(column))
                  .whereIn(column.category, ids)
                  .orderBy(column.start)
                  .then(
                    rows => (this._set(rows) ? true : false),
                    error => {
                      throw error;
                    },
                  )
              : false;
          case dbSchema.timeline.category.column.name:
            return ids
              ? await db(table)
                  .select(Object.values(column))
                  .whereIn(
                    column.category,
                    ids
                      ? await db(timeline.category.table)
                          .select(timeline.category.column.id)
                          .whereIn(criteria, ids)
                          .orderBy(timeline.category.column.id)
                          .then(
                            rows =>
                              Object.values(rows).map(
                                current => current[timeline.category.column.id],
                              ),
                            error => {
                              throw error;
                            },
                          )
                      : false,
                  )
                  .orderBy(column.start)
                  .then(
                    rows => (this._set(rows) ? true : false),
                    error => {
                      throw error;
                    },
                  )
              : false;
          default:
            return ids
              ? await db(table)
                  .select(Object.values(column))
                  .whereIn(
                    criteria ? criteria : column.id,
                    ids === factory.all ? await this._selectAllItems() : ids,
                  )
                  .orderBy(column.start)
                  .then(
                    rows => (this._set(rows) ? true : false),
                    error => {
                      throw error;
                    },
                  )
              : false;
        }
      }
      throw new Error('Cotainer is not an object');
    } catch (error) {
      console.error('Items provider', error);
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
        const { _, db, dbSchema, validator, factory } = this._container.cradle;
        const { table, column } = dbSchema.timeline.item;

        return ids === factory.all
          ? db(table)
              .select(column.id)
              .where(column.active, true)
              .orderBy(column.start)
              .then(
                rows => {
                  if (validator.env.local) {
                    console.log('Selected item ids', rows);
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
      console.error('Item selector', error);
    }
    return false;
  }

  /**
   * Item mocks provider.
   * @private
   */
  async _getMocks() {
    try {
      if (this._container instanceof Object && this._items.criteria === 'mock') {
        const { validator } = this._container.cradle;
        const { _, dbSchema, locale, placeholders, Random, LoremIpsum } = this._container.cradle;
        const { column } = dbSchema.timeline.item;

        if (validator.env.local && !this._items.ids) {
          this._mocks.rows = [];
          const content = placeholder => {
            let rows = {};
            const alt = LoremIpsum.generateSentences(1);

            Object.values(locale).forEach(
              current => (rows[current] = `<img src="${placeholder}" alt="${alt}" />`),
            );
            return _.size(rows) > 0 ? JSON.stringify(rows) : false;
          };

          while (this._mocks.count >= 1) {
            this._mocks.rows.push({
              [column.active]: true,
              [column.category]: Math.trunc(Random.sample(await category(this._container), 1)),
              [column.content]: content(placeholders.imageTimelineItem),
              [column.start]: Random.date(new Date('2000-09-13T03:24:17'), new Date(Date.now())),
            });
            this._mocks.count -= 1;
          }
          return _.size(this._mocks.rows) > 0 ? true : false;
        }
      }
    } catch (error) {
      console.error('Item mocks provider', error);
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
          console.log('Setting timeline item rows', JSON.stringify(this._items.rows));
        }
        return this._items.rows ? true : false;
      }
    } catch (error) {
      console.error('Timeline item entity setter', error);
    }
    return false;
  }
};
