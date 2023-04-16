/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    await knex('organization').insert([
      {id: 100, admin_id: 100,title:'organizer',description:"Some description",location:"Ukraine"}
    ]);
  };