/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('users', function(table) {
          table.increments('id').primary();
          table.string('login').notNullable().unique();
          table.string('password').notNullable();
          table.string('email').unique().notNullable();
          table.string('role').references('role');
          table.boolean('isActive').defaultTo(true);
          table.timestamps(true, true);
        }),
    
        knex.schema.createTable('event', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('title').notNullable();
            table.string('organizer')
            table.string('type')
            table.text('description');
            table.string('price').notNullable()
            table.timestamp('duration')
            table.timestamp('event-datetime')
            table.boolean('completed').defaultTo(false);
      
            table.foreign('user_id').references('id').inTable('users')
        }),

        knex.schema.createTable('organization', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('title').notNullable();
            table.string('organizer')
            table.string('type')
            table.text('description');

            table.foreign('user_id').references('id').inTable('users')
        }),


        knex.schema.createTable('comment', function(table) {
            table.increments('id').primary();
            table.integer('event_id').unsigned().notNullable();
            table.text('comment').notNullable();

            table.foreign('event_id').references('id').inTable('event')
        }),


        knex.schema.createTable('role', function(table) {
            table.increments('id').primary();
            table.string('value').notNullable().unique().defaultTo('USER')
        }),
        

      ]);
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('event'),
        knex.schema.dropTable('organization'),
        knex.schema.dropTable('comment'),
        knex.schema.dropTable('role'),
        knex.schema.dropTable('users')
    ]);
};
