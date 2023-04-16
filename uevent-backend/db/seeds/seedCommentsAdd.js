/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    await knex('comment').insert([
      {id: 100, content: "Privet",author_id:null,author_organization_id: 100,event_id: 100,main_comment_id: null,comment_id: null,receiver_name: null},
      {id: 200, content: "I tebe Privet",author_id:200,author_organization_id: null,event_id: 100,main_comment_id: 1,comment_id: 1,receiver_name: "admin"}

    ]);
  };