const knex = require('knex')

module.exports = {
  development: {
    client: 'postgres',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '1234',
      database: 'postgres',
    },
  },
};