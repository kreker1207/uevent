/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('users', (table) => {
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
            table.string('location', 256).defaultTo(null);
            table.string('phone_number', 20).defaultTo(null);
            table.string('org_pic', 128).defaultTo('none.png');
            
            table.foreign('admin_id').references('id').inTable('users').onDelete('cascade')
        }),
    
        knex.schema.createTable('event', (table) => {
            table.increments('id').primary();
            table.integer('organizer_id').unsigned().notNullable();
            table.string('title', 40).notNullable();
            table.text('description').notNullable();
            table.integer('seat').notNullable();
            table.string('price', 20).notNullable();
            table.string('event_datetime', 32).notNullable();
            table.enu('format', ['concert', 'meet_up', 'festival', 'show', 'custom'],
                { useNative: true, enumName: 'format' }).defaultTo('custom');
            table.string('location', 256).notNullable();
            table.string('publish_date',32).defaultTo(knex.fn.now().toDate());
            table.string('eve_pic', 128).defaultTo('none.png');

            table.foreign('organizer_id').references('id').inTable('organization').onDelete('cascade')
        }),

        knex.schema.createTable('theme', (table) => {
            table.increments('id').primary();
            table.string('name', 30).notNullable().unique();
        }),

        knex.schema.createTable('event_theme', (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().notNullable();
            table.integer('theme_id').unsigned().notNullable();

            table.foreign('event_id').references('id').inTable('event').onDelete('cascade');
            table.foreign('theme_id').references('id').inTable('theme').onDelete('cascade');
        }),


        knex.schema.createTable('comment', (table) => {
            table.increments('id').primary();
            table.text('content').notNullable();

            table.integer('author_id').unsigned().defaultTo(null);
            table.integer('author_organization_id').unsigned().defaultTo(null);
            
            table.integer('event_id').unsigned().defaultTo(null);
            table.integer('comment_id').unsigned().defaultTo(null);
            // do we need timestamps?
            table.timestamps(true, true);
            table.string('receiver_name', 40).defaultTo(null);
            table.foreign('author_id').references('id').inTable('users');
            table.foreign('author_organization_id').references('id').inTable('organization');
            
            table.foreign('event_id').references('id').inTable('event').onDelete('cascade');
            table.foreign('comment_id').references('id').inTable('comment').onDelete('cascade');

            table.check('((?? is not null):: integer + (?? is not null):: integer) = 1', 
                ['author_organization_id', 'author_id']);
            table.check('((?? is not null):: integer + (?? is not null):: integer) = 1', 
                ['event_id', 'comment_id']);
        }),

        knex.schema.createTable('purchase', (table) => {
            table.string('id', 64).primary();
            table.integer('user_id').unsigned().notNullable();
            table.integer('event_id').unsigned().notNullable();
            table.boolean('status').notNullable().defaultTo(false);

            table.foreign('user_id').references('id').inTable('users').onDelete('cascade');
            table.foreign('event_id').references('id').inTable('event').onDelete('cascade');
        }),

        knex.schema.createTable('promo', (table) => {
            table.increments('id').primary();

            table.string('name', 20).notNullable().unique();
            //discount percentage from 1 to 100
            table.integer('discount').checkBetween([1, 100]).notNullable();
            table.datetime('expires').defaultTo(knex.raw('CURRENT_TIMESTAMP + INTERVAL \'30 days\''));
        }),

        knex.schema.createTable('sub', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.integer('event_id').unsigned().notNullable();

            table.foreign('user_id').references('id').inTable('users').onDelete('cascade');
            table.foreign('event_id').references('id').inTable('event').onDelete('cascade');
        })
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('event'),
        knex.schema.dropTable('seat'),
        knex.schema.dropTable('organization'),
        knex.schema.dropTable('comment'),
        knex.schema.dropTable('users')
    ]);
};
