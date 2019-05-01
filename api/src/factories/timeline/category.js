/**
 * Timeline cateogry entities factory.
 */
module.exports = class Category {
  /**
   * @param {Object|Boolean} - awilix container
   */
  constructor(container = false) {
    this._container = false;
    this._categories = {
      ids: false,
      rows: false,
    };
    this._mocks = {
      count: 6,
      rows: false,
    };

    try {
      if (container instanceof Object) {
        this._container = container;
        /**
         * @todo: contaier check
         */
      }
    } catch (error) {
      console.error(`Timeline category container loading`, error);
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

        this._categories.ids = validator.timeline.category.id(ids);
      }
    } catch (error) {
      console.error(`Category ids selector`, error);
    }
    return this;
  }

  /**
   * Category entities provider.
   * @param {String|Boolean} criteria - column name selector or other type criteria
   */
  async get(criteria = false) {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;
        this._categories.criteria = validator.timeline.category.criteria(criteria);

        if (await this._getCategories()) {
          const { ids, rows } = this._categories;
          return validator.timeline.category.single(ids) ? rows[0] : rows;
        }
        if (await this._getMocks()) {
          return this._mocks.rows;
        }
      }
    } catch (error) {
      console.error(`Category provider`, error);
    }
    return false;
  }

  /**
   * Categories provider.
   * @private
   */
  async _getCategories() {
    try {
      if (this._container instanceof Object && this._categories.criteria !== 'mock') {
        const { ids } = this._categories;
        const { db, dbSchema } = this._container.cradle;
        const { table, column } = dbSchema.timeline.category;

        return ids
          ? await db(table)
              .select(Object.values(column))
              .whereIn(column.id, ids === 'all' ? await this._selectAllCategories() : ids)
              .orderBy(column.id)
              .then(
                rows => (this._set(rows) ? true : false),
                error => {
                  throw error;
                },
              )
          : false;
      }
    } catch (error) {
      console.error('Categories provider', error);
    }
    return false;
  }

  /**
   * Active categories selector.
   * @private
   */
  async _selectAllCategories() {
    try {
      if (this._container instanceof Object) {
        const { ids } = this._categories;
        const { _, db, dbSchema, validator } = this._container.cradle;
        const { table, column } = dbSchema.timeline.category;

        return ids === 'all'
          ? db(table)
              .select(column.id)
              .where(column.active, true)
              .orderBy(column.id)
              .then(
                rows => {
                  if (validator.env.local) {
                    console.log('Selected category ids', rows);
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
      console.error('Category selector', error);
    }
    return false;
  }

  /**w
   * Category mocks provider.
   * @private
   */
  _getMocks() {
    try {
      if (this._container instanceof Object && this._categories.criteria === 'mock') {
        const { validator } = this._container.cradle;
        const { dbSchema, locale, LoremIpsum } = this._container.cradle;
        const { column } = dbSchema.timeline.category;

        if (validator.env.local) {
          this._mocks.rows = [];

          while (this._mocks.count >= 1) {
            this._mocks.rows.push({
              [column.active]: true,
              [column.name]: JSON.stringify(
                Object.values(locale).map(current => ({
                  [current]: LoremIpsum.generateSentences(1),
                })),
              ),
              [column.description]: JSON.stringify(
                Object.values(locale).map(current => ({
                  [current]: LoremIpsum.generateSentences(3),
                })),
              ),
            });
            this._mocks.count -= 1;
          }
          return this._mocks.rows.length > 0 ? true : false;
        }
      }
    } catch (error) {
      console.error('Category mocks provider', error);
    }
    return false;
  }

  /**
   * Collected category entities setter.
   * @param {array} rows
   * @private
   */
  _set(rows) {
    try {
      if (this._container instanceof Object) {
        const { validator } = this._container.cradle;
        this._categories.rows = validator.timeline.category.row(rows);
        if (validator.env.local) {
          console.log('Setting timeline category rows'), JSON.stringify(this._categories.rows);
        }
        this._categories.rows ? true : false;
      }
    } catch (error) {
      console.error('Timeline category entity setter', error);
    }
    return false;
  }
};
