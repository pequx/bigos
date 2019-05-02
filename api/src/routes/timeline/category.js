/**
 * Timeline category router.
 * @param {Object|Boolean} container - the awilix container
 */
module.exports = (container = false) => {
  try {
    if (container instanceof Object) {
      const { api, RouterTimelineCategory, FactoryTimelineCategory, validator } = container.cradle;

      api.use('/timeline/category', RouterTimelineCategory);

      /**
       * Provide all categories.
       */
      RouterTimelineCategory.get('/all', async (req, res) => {
        const categories = await new FactoryTimelineCategory(container).select('all').get();

        res.json(validator.timeline.category.response(categories));
      });

      /**
       * Provide categories over ids.
       */
      RouterTimelineCategory.get('/:ids', async (req, res) => {
        let { ids } = req.params;
        ids = validator.timeline.category.id(ids.split(new RegExp(/\D/g)).map(Number));
        const categories =
          ids.length > 0 ? await new FactoryTimelineCategory(container).select(ids).get() : false;

        res.json(validator.timeline.category.response(categories));
      });
    } else {
      throw new Error('Container invalid');
    }
  } catch (error) {
    console.error('Timeline category router', error);
  }
};
