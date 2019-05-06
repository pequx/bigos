/**
 * Timeline item reouter.
 * @param {Object|Boolean} container - the awilix container
 */
module.exports = (container = false) => {
  try {
    if (container instanceof Object) {
      const { api, routes, RouterTimelineItem, FactoryTimelineItem, validator } = container.cradle;
      const { item } = routes.timeline;

      api.use(item.api, RouterTimelineItem);

      /**
       * Provide all items.
       */
      RouterTimelineItem.get(item.all, async (req, res) => {
        const items = await new FactoryTimelineItem(container).select('all').get();

        res.json(validator.timeline.item.response(items));
      });

      /**
       * Provide items over ids.
       */
      RouterTimelineItem.get('/:ids', async (req, res) => {
        let { ids } = req.params;
        ids = validator.timeline.item.id(ids.split(new RegExp(/\D/g)).map(Number));
        const items =
          ids.length > 0 ? await new FactoryTimelineItem(container).select(ids).get() : false;

        res.json(validator.timeline.item.response(items));
      });

      /**
       * Provide all items in category/ies.
       */
      RouterTimelineItem.get(`${item.category}/:ids`, async (req, res) => {
        let { ids } = req.params;
        const { dbSchema } = container.cradle;
        const { column } = dbSchema.timeline.item;

        ids = ids.split(new RegExp(/\W/g));
        const id = validator.timeline.item.id(ids);
        const name = !id ? validator.timeline.category.name(ids) : false;

        const items =
          ids.length > 0
            ? name
              ? await new FactoryTimelineItem(container)
                  .select(name)
                  .get(dbSchema.timeline.category.column.name)
              : await new FactoryTimelineItem(container).select(id).get(column.category)
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
