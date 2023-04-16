/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    await knex('promo').insert([
      {id: 1, name: 'DEDSDEVTOOLS', discount: 100, expires: null},
      {id: 2, name: 'SOMETESTDISCOUNT', discount: 15, expires: null}
    ]);
};