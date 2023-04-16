const { default: knex } = require('knex');
const knexfile = require('../db/knexfile');
const Entity = require('./entity');

module.exports = class Organization extends Entity {
    constructor(tableName) {
        super(tableName);
    }
    async getAll(page = null, limit = 20){
        if (page === null || page === undefined) {
            page = 0;
          }
          const knexInstance = knex(knexfile);
        return await super.table().leftJoin('event', 'organization.id', 'event.organizer_id').join('users','organization.admin_id', 'users.id')
        .select('organization.*','users.email', knexInstance.raw('COUNT(event.id) as num_events'))
        .groupBy('organization.id','users.email').paginate({ isLengthAware: true, perPage: limit, currentPage: page });

    }
    async getSearchAll({ filter } = {}) {
        const knexInstance = knex(knexfile);
        let query = super.table()
          .leftJoin('event', 'organization.id', 'event.organizer_id')
          .join('users', 'organization.admin_id', 'users.id')
          .select('organization.*', 'users.email', knexInstance.raw('COUNT(event.id) as num_events'))
          .groupBy('organization.id', 'users.email')
          .orderBy('organization.title', 'asc');
        if (filter) {
          query = query.andWhere((builder) => {
            builder.where('organization.title', 'ilike', `${filter}%`);
          });
        }
        const orgs = await query;
        return orgs;
      }
}