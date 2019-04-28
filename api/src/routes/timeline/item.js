const express = require('express');
const router = express.Router();

const { factory } = require('../../constants');

const Item = require('../../factories/timeline/item');

/**
 * @param {Object} api
 */
module.exports = api => {
  api.use('/timeline/item', router);

  router.get('/all', async (req, res) => {
    const items = await new Item(factory.all).get();
    const valid = items && items.length > 0;
    res.json(valid ? items : false);
  });

  router.get('/:ids', async (req, res) => {
    const ids = req.params.ids.split(new RegExp(/\D/g)).map(Number);
    const items = await new Item(ids).get();
    const valid = ids.length > 0 && items && items.length > 0;
    res.json(valid ? items : false);
  });
};
