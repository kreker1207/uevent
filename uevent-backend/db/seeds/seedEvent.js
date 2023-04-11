/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    await knex('event').insert([
      {id: 1, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-07T13:00:00.00"}
    ]);
  };