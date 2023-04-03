/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('users', function(table) {
          table.increments('id').primary();
          table.string('login').notNullable().unique();
          table.string('email').notNullable().unique();
          table.string('password').notNullable();
          table.string('profile_pic').defaultTo('none.png');
          table.boolean('is_active').defaultTo(true);
          table.timestamps(true, true);
        }),

        knex.schema.createTable('organizations', function(table) {
            table.increments('id').primary();
            table.integer('admin_id').unsigned().notNullable();
            table.string('title', 60).notNullable();
            // Do we really need type?
            //table.string('type')
            table.text('description');
            table.string('location', 60);
            
            table.foreign('admin_id').references('id').inTable('users')
        }),
    
        knex.schema.createTable('events', function(table) {
            table.increments('id').primary();
            table.integer('organizer_id').unsigned().notNullable();
            table.string('title', 40).notNullable();
            table.text('description');
            table.timestamp('event-datetime')
      
            table.foreign('organizer_id').references('id').inTable('organizations')
        }),

        knex.schema.createTable('seats', function(table) {
            table.increments('id').primary();
            table.integer('event_id').unsigned().notNullable();
            table.integer('number').notNullable();
            table.integer('row');
            table.string('price', 20);
            table.boolean('is_available').defaultTo(true);
      
            table.foreign('event_id').references('id').inTable('events');
        }),


        knex.schema.createTable('comments', function(table) {
            table.increments('id').primary();
            table.text('content').notNullable();

            table.integer('author_id').unsigned();
            table.integer('author_organization_id').unsigned();

            table.integer('organization_id').unsigned().defaultTo(null);
            table.integer('event_id').unsigned().defaultTo(null);
            table.integer('comment_id').unsigned().defaultTo(null);

            table.foreign('author_id').references('id').inTable('users');
            table.foreign('author_organization_id').references('id').inTable('organizations');
            
            table.foreign('organization_id').references('id').inTable('organizations');
            table.foreign('event_id').references('id').inTable('events');
            table.foreign('comment_id').references('id').inTable('comments');

            table.check('((?? is not null):: integer + (?? is not null):: integer) = 1', 
                ['author_organization_id', 'author_id']);
            table.check('((?? is not null):: integer + (?? is not null):: integer + (?? is not null):: integer) = 1', 
                ['organization_id', 'event_id', 'comment_id']);
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
