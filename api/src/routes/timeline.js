const express = require('express');
const router = express.Router();

const { factory } = require('../../src/constants');

const Category = require('../../src/factories/timeline/category');

/**
 * @param {Object} api
 */
module.exports = api => {
  api.use('/timeline/category', router);

  router.get('/all', (req, res) => {
    const categories = new Category(factory.all).get();
    const valid = categories && categories.length > 0;
    res.json(valid ? categories : false);
  });

  router.get('/:ids', async (req, res) => {
    const ids = req.params.ids.split(new RegExp(/\D/g)).map(Number);
    const categories = await new Category(ids).get();
    const valid = ids.length > 0 && categories && categories.length > 0;
    res.json(valid ? categories : false);
  });
};
