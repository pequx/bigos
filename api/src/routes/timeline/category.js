/**
 * Timeline category router.
 * @param {Object|Boolean} container - the awilix container
 */
module.exports = (container = false) => {
  try {
    if (container instanceof Object) {
      const { api, Router, FactoryTimelineCategory, validator } = container.cradle;

      api.use('/timeline/category', Router);

      /**
       * Provide all categories.
       */
      Router.get('/all', async (req, res) => {
        res.json(
          validator.timeline.category.response(
            await new FactoryTimelineCategory(container).select('all').get(),
          ),
        );
      });

      /**
       * Provide categories over ids.
       */
      Router.get('/:ids', async (req, res) => {
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
