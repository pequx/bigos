const { dbSchema } = require('../src/constants');

/**
 * Initial migration
 */
exports.up = async knex => {
  return await knex.schema
    .createTable(dbSchema.timeline.category.table, table => {
      /**
       * Create `timelineItemCategories`
       */
      const { column } = dbSchema.timeline.category;

      table.increments(column.id);
      table
        .boolean(column.active)
        .notNullable()
        .defaultTo(false);
      table.jsonb(column.name).notNullable();
      table.jsonb(column.description);

      table.timestamps(true, true);
    })
    .createTable(dbSchema.timeline.item.table, table => {
      /**
       * Create `timelineItems`
       */
      const { column } = dbSchema.timeline.item;

      table.increments(column.id);
      table
        .boolean(column.active)
        .notNullable()
        .defaultTo(false);
      table.integer(column.category).notNullable();
      table.jsonb(column.content).notNullable();
      table.date(column.start).notNullable();
      table.date(column.end);

      table.timestamps(true, true);

      //table.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade');
    })
    .createTable(dbSchema.timeline.detail.table, table => {
      /**
       * Create `timelineDetails`
       */
      const { column } = dbSchema.timeline.detail;

      table.increments(column.id);
      table
        .boolean(column.active)
        .notNullable()
        .defaultTo(false);
      table.jsonb(column.name).notNullable();
      table.jsonb(column.operational).notNullable();
      table.jsonb(column.image).notNullable();
      table.jsonb(column.link).notNullable();
      table.jsonb(column.index).notNullable();
      table.jsonb(column.description).notNullable();
      table.integer(column.parent).notNullable();
      table.jsonb(column.industry).notNullable();
      table.jsonb(column.region).notNullable();

      table.timestamps(true, true);
    })
    .createTable(dbSchema.blog.post.table, table => {
      /**
       * Create `blogPosts`
       */
      const { column } = dbSchema.blog.post;

      table.increments(column.id);
      table
        .boolean(column.active)
        .notNullable()
        .defaultTo(false);
      table.jsonb(column.title).notNullable();
      table.jsonb(column.image).notNullable();
      table.jsonb(column.description).notNullable();
      table.jsonb(column.keywords).notNullable();
      table.jsonb(column.content).notNullable();

      table.timestamps();
    });
};

const { timeline } = dbSchema;

exports.down = async (knex, Promise) => {
  knex.schema
    .dropTable(timeline.category.tabl)
    // .then(values => result(values), error => result(error))
    .dropTable(timeline.item.table)
    // .then(values => result(values), error => result(error))
    .dropTable(timeline.detail.table)
    // .then(values => result(values), error => result(error))
    .dropTable(dbSchema.blog.post.table);
  // .then(values => result(values), error => result(error));
};
