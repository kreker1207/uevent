/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    await knex('comment').insert([
      {id: 1, content: "Privet",author_id:1,author_organization_id: null,event_id: 1,main_comment_id: null,comment_id: null,receiver_name: null},
      {id: 2, content: "I tebe Privet",author_id:2,author_organization_id: null,event_id: 1,main_comment_id: 1,comment_id: 1,receiver_name: "admin"}

    ]);
  };