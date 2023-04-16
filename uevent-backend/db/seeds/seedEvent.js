/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    await knex('event').insert([
      {id: 100, organizer_id: 100,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-20T13:00:00.00"}
    ]);
  };