/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex) {
    // Deletes ALL existing entries in the comment table
    return knex('comment').del()
      .then(function () {
        console.log('Deleted all comments.');
      });
  };