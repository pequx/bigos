const express = require('express');
const router = express.Router();

const { factory } = require('../../src/constants');

const Category = require('../../src/factories/timeline/category');

module.exports = api => {
  api.use('/timeline', router);

  router.get('/category/all', async (req, res) => {
    const category = new Category(factory.all);
    res.json(await category.get());
  });
};
