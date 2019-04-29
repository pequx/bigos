const express = require('express');
const router = express.Router();

const { factory } = require('../../constants');
const { dbSchema } = require('../../../src/constants');
const { timeline } = dbSchema;

const Item = require('../../factories/timeline/item');
const { validator } = require('../../../src/factories/validator');

/**
 * @param {Object} api
 */
module.exports = api => {
  api.use('/timeline/item', router);

  /**
   * Provide all items.
   */
  router.get('/all', async (req, res) => {
    const items = await new Item(factory.all).get();
    res.json(validator.timeline.item.response(items));
  });

  /**
   * Provide items over ids.
   */
  router.get('/:ids', async (req, res) => {
    const ids = req.params.ids.split(new RegExp(/\D/g)).map(Number);
    const items = ids.length > 0 ? await new Item(ids).get() : false;
    res.json(validator.timeline.item.response(items));
  });

  /**
   * Provide all items in category/ies.
   */
  router.get('/category/:ids', async (req, res) => {
    const { column } = timeline.item;
    let { ids } = req.params;
    ids = ids.split(new RegExp(/\D/g)).map(Number);
    const items = ids.length > 0 ? await new Item(ids).get(column.category) : false;
    res.json(validator.timeline.item.response(items));
  });
};
