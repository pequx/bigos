const express = require('express');
const router = express.Router();

const { factory } = require('../../constants');

/**
 * @param {Object} container - awilix container
 */
module.exports = container => {
  container.resolve('api').use('/timeline/item', router);

  const { FactoryTimelineItem, validator, dbSchema } = container.cradle;
  const { timeline } = dbSchema;
  /**
   * Provide all items.
   */
  router.get('/all', async (req, res) => {
    const items = await new FactoryTimelineItem(factory.all, container).get();
    res.json(validator.timeline.item.response(items));
  });

  /**
   * Provide items over ids.
   */
  router.get('/:ids', async (req, res) => {
    let { ids } = req.params;
    ids = validator.timeline.item.ids(ids.split(new RegExp(/\D/g)).map(Number));
    const items = ids.length > 0 ? await new FactoryTimelineItem(ids, container).get() : false;
    res.json(validator.timeline.item.response(items));
  });

  /**
   * Provide all items in category/ies.
   */
  router.get('/category/:ids', async (req, res) => {
    const { column } = timeline.item;
    let { ids } = req.params;
    ids = validator.timeline.item.ids(ids.split(new RegExp(/\D/g)).map(Number));
    const items =
      ids.length > 0 ? await new FactoryTimelineItem(ids, container).get(column.category) : false;
    res.json(validator.timeline.item.response(items));
  });
};
