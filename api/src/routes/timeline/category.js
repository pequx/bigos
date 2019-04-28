const express = require('express');
const router = express.Router();

const { factory } = require('../../constants');

const Category = require('../../factories/timeline/category');

/**
 * @param {Object} container - awilix container
 */
module.exports = container => {
  const { api } = container.cradle;
  api.use('/timeline/category', router);

  router.get('/all', async (req, res) => {
    const categories = await new Category(factory.all).get();
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
