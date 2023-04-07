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

        knex.schema.createTable('organization', function(table) {
            table.increments('id').primary();
            table.integer('admin_id').unsigned().notNullable();
            // Unique!
             //logo(img)512
            table.string('title', 60).notNullable();
            table.text('description');
            table.string('location', 60);
            
            table.foreign('admin_id').references('id').inTable('users')
        }),
    
        knex.schema.createTable('event', function(table) {
            table.increments('id').primary();
            table.integer('organizer_id').unsigned().notNullable();
            table.string('title', 40).notNullable();
            //location(string)
            //img base64
            table.text('description');
            table.timestamp('event_datetime');
            table.string('location', 240).notNullable();
      
            table.foreign('organizer_id').references('id').inTable('organization')
        }),
        //Theme() format(fest, concert) 

        knex.schema.createTable('seat', function(table) {
            table.increments('id').primary();
            table.integer('event_id').unsigned().notNullable();
            table.integer('number').notNullable();
            table.integer('row');
            table.string('price', 20);
            //publish date
            table.boolean('is_available').defaultTo(true);
      
            table.foreign('event_id').references('id').inTable('event');
        }),


        knex.schema.createTable('comment', function(table) {
            table.increments('id').primary();
            table.text('content').notNullable();
            //sender
            table.integer('author_id').unsigned();
            //organizator sender
            table.integer('author_organization_id').unsigned();
            
            // targets
            table.integer('event_id').unsigned().defaultTo(null);
            table.integer('main_comment_id').unsigned().defaultTo(null);
            table.integer('comment_id').unsigned().defaultTo(null);
            //

            table.foreign('author_id').references('id').inTable('users');
            table.foreign('author_organization_id').references('id').inTable('organization');
            
            table.foreign('event_id').references('id').inTable('event');
            table.foreign('comment_id').references('id').inTable('comment');
            table.foreign('main_comment_id').references('id').inTable('comment');

            table.check('((?? is not null):: integer + (?? is not null):: integer) = 1', 
                ['author_organization_id', 'author_id']);
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
        knex.schema.dropTable('seat'),
        knex.schema.dropTable('organization'),
        knex.schema.dropTable('comment'),
        knex.schema.dropTable('users')
    ]);
};
