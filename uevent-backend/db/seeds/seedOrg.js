const bcrypt = require('bcryptjs');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 const hashedPassword = bcrypt.hashSync('organizer',8)
 exports.seed = async function(knex) {
    await knex('organization').insert([
      {id: 1, admin_id: 1,title:'organizer',description:"Some description",location:"Ukraine"}
    ]);
  };