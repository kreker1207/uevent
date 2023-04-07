/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('user', (table) => {
          table.increments('id').primary();
          table.string('login', 40).notNullable().unique();
          table.string('email', 80).notNullable().unique();
          table.string('password', 128).notNullable();
          table.string('profile_pic', 128).notNullable().defaultTo('none.png');
          table.boolean('is_active').defaultTo(true);
          table.timestamps(true, true);
        }),

        knex.schema.createTable('organization', (table) => {
            table.increments('id').primary();
            table.integer('admin_id').unsigned().notNullable();
            table.string('title', 60).notNullable();
            table.text('description').notNullable();
            table.string('location', 60).defaultTo(null);
            table.string('phone_number', 20).defaultTo(null);
            table.string('org_pic', 128).defaultTo('none.png');
            
            table.foreign('admin_id').references('id').inTable('user')
        }),
    
        knex.schema.createTable('event', (table) => {
            table.increments('id').primary();
            table.integer('organizer_id').unsigned().notNullable();
            table.string('title', 40).notNullable();
            table.text('description').notNullable();
            table.timestamp('event-datetime').notNullable();
            table.enu('column', ['concert', 'meet_up', 'festival', 'show', 'custom'],
                { useNative: true, enumName: 'format' }).defaultTo('custom');
            table.string('location', 256).notNullable();
            table.string('eve_pic', 128).defaultTo('none.png');
      
            table.foreign('organizer_id').references('id').inTable('organization')
        }),

        knex.schema.createTable('seat', (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().notNullable();
            table.integer('number').notNullable();
            table.integer('row').defaultTo(null);
            table.string('price', 20).defaultTo(null);
            table.boolean('is_available').defaultTo(true);
      
            table.foreign('event_id').references('id').inTable('event');
        }),

        knex.schema.createTable('theme', (table) => {
            table.increments('id').primary();
            table.string('name', 30).notNullable();
        }),

        knex.schema.createTable('event_theme', (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().notNullable();
            table.integer('theme_id').unsigned().notNullable();

            table.foreign('event_id').references('id').inTable('event');
            table.foreign('theme_id').references('id').inTable('theme');
        }),


        knex.schema.createTable('comment', (table) => {
            table.increments('id').primary();
            table.text('content').notNullable();

            table.integer('author_id').unsigned().defaultTo(null);
            table.integer('author_organization_id').unsigned().defaultTo(null);

            table.integer('organization_id').unsigned().defaultTo(null);
            table.integer('event_id').unsigned().defaultTo(null);
            table.integer('comment_id').unsigned().defaultTo(null);

            table.string('receiver_name', 40).defaultTo(null);

            table.foreign('author_id').references('id').inTable('user');
            table.foreign('author_organization_id').references('id').inTable('organization');
            
            table.foreign('organization_id').references('id').inTable('organization');
            table.foreign('event_id').references('id').inTable('event');
            table.foreign('comment_id').references('id').inTable('comment');

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
