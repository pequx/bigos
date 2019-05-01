/**
 * Timeline item reouter.
 * @param {Object|Boolean} container - the awilix container
 */
module.exports = (container = false) => {
  try {
    if (container instanceof Object) {
      const { api, Router, FactoryTimelineItem, validator } = container.cradle;

      api.use('/timeline/item', Router);

      /**
       * Provide all items.
       */
      Router.get('/all', async (req, res) => {
        const items = await new FactoryTimelineItem(container).select('all').get();

        res.json(validator.timeline.item.response(items));
      });

      /**
       * Provide items over ids.
       */
      Router.get('/:ids', async (req, res) => {
        let { ids } = req.params;
        ids = validator.timeline.item.id(ids.split(new RegExp(/\D/g)).map(Number));
        const items =
          ids.length > 0 ? await new FactoryTimelineItem(container).select(ids).get() : false;

        res.json(validator.timeline.item.response(items));
      });

      /**
       * Provide all items in category/ies.
       */
      Router.get('/category/:ids', async (req, res) => {
        let { ids } = req.params;
        const { dbSchema } = container.cradle;
        const { column } = dbSchema.timeline.item;
        ids = validator.timeline.item.id(ids.split(new RegExp(/\D/g)).map(Number));
        const items =
          ids.length > 0
            ? await new FactoryTimelineItem(container).select(ids).get(column.category)
            : false;

        res.json(validator.timeline.item.response(items));
      });
    } else {
      throw new Error('Container invalid');
    }
  } catch (error) {
    console.error('Timeline item router', error);
  }
};
