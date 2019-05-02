const { dbSchema } = require('../src/constants');

/**
 * Initial migration
 */
exports.up = knex => {
  return knex.schema
    .createTable(dbSchema.timeline.category.table, table => {
      /**
       * Create `timelineItemCategories`
       */
      const { column } = dbSchema.timeline.category;

      table.increments(column.id).primary();
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
      const { item, category } = dbSchema.timeline;

      table.increments(item.column.id).primary();
      table
        .boolean(item.column.active)
        .notNullable()
        .defaultTo(false);
      table
        .integer(item.column.category)
        .notNullable()
        .references(category.column.id)
        .inTable(category.table)
        .onDelete('cascade');
      table.jsonb(item.column.content).notNullable();
      table.date(item.column.start).notNullable();
      table.date(item.column.end);

      table.timestamps(true, true);
    })
    .createTable(dbSchema.timeline.detail.table, table => {
      /**
       * Create `timelineDetails`
       */
      const { column } = dbSchema.timeline.detail;

      table.increments(column.id).primary();
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

      table.increments(column.id).primary();
      table
        .boolean(column.active)
        .notNullable()
        .defaultTo(false);
      table.jsonb(column.title).notNullable();
      table.jsonb(column.image).notNullable();
      table.jsonb(column.description).notNullable();
      table.jsonb(column.keywords).notNullable();
      table.jsonb(column.content).notNullable();

      table.timestamps(true, true);
    });
};

const { timeline } = dbSchema;

exports.down = async (knex, Promise) => {
  knex.schema
    .dropTable(timeline.category.table)
    .dropTable(timeline.item.table)
    .dropTable(timeline.detail.table)
    .dropTable(dbSchema.blog.post.table);
};
