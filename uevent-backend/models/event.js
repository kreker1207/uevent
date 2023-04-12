const { default: knex } = require('knex');
const knexfile = require('../db/knexfile');
const Entity = require('./entity');

module.exports = class Event extends Entity {
    constructor(tableName) {
        super(tableName);
    }
    async getAll(page = null, limit = 20){
        if (page === null || page === undefined) {
            page = 0;
          }
          const knexInstance = knex(knexfile);
        return await super.table().select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
        .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
        .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
        .groupBy('event.id')
        .orderBy('event.event_datetime', 'asc').paginate({ isLengthAware: true, perPage: limit, currentPage: page });

    }
    async getById(id){
      if(id){
        const knexInstance = knex(knexfile);
        return await super.table().select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
        .where({'event.id':id})
        .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
        .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
        .groupBy('event.id')
        .orderBy('event.event_datetime', 'asc');
      }
    }

    async getAdminId(eventId){
        if(eventId){
            return await super.table().select('users.id as admin_id')
            .from('event')
            .join('organization', 'event.organizer_id', '=', 'organization.id')
            .join('users', 'organization.admin_id', '=', 'users.id')
            .where({ 'event.id': eventId });
        }
        else return result[0];
    }
    async getEventByUserId(userId,page = null, limit = 4){
        if(userId){
            return await super.table().select('event.*')
            .from('event')
            .join('organization', 'event.organizer_id', '=', 'organization.id')
            .join('users', 'organization.admin_id', '=', 'users.id')
            .where('users.id', '=', userId).paginate({ isLengthAware: true, perPage: limit, currentPage: page });
        }
        else return result[0];
    }
    async getEventByOrgId(orgId,page = null, limit = 4){
      if(orgId){
          return await super.table().select('event.*')
          .where('organizer_id', '=', orgId).paginate({ isLengthAware: true, perPage: limit, currentPage: page });
      }
      else return result[0];
  }
  async getEventWithFilter(filters, page = null, limit = 20) {
    if (page === null || page === undefined) {
      page = 0;
    }
    const knexInstance = knex(knexfile);
    console.log(filters)
  
    const events = await knexInstance('event')
      .select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
      .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
      .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
      .where(function() {
        if (filters.format) {
          this.where('event.column', '=', filters.format);
        }
        if (filters.theme) {
          this.whereIn('theme.name', filters.theme);
        }
        if (filters.event_datetime) {
          const timestamp = isNaN(Date.parse(filters.event_datetime)) ? null : new Date(filters.event_datetime).toISOString();
          if (timestamp) {
            this.where('event.event_datetime', '>=', knexInstance.raw('now()::timestamp with time zone'));
          } else {
            this.where(knexInstance.raw("to_timestamp(event.event_datetime, 'YYYY-MM-DD HH24:MI:SS') >= ?", timestamp));
          }
        } 
      })
      .groupBy('event.id')
      .paginate({ isLengthAware: true, perPage: limit, currentPage: page });
  
    return events;
  }

    
    async setEvent(eventData) {
      console.log(eventData)
        const knexInstance = knex(knexfile); 
        const newEvent = await 
        knexInstance.transaction(async trx => {
            // Check if tags exist, and insert any new tags
            const tagIds = []
            for (const tagName of eventData.tags) {
              const [tag] = await trx('theme').where('name', tagName)
              if (tag) {
                tagIds.push(tag.id)
              } else {
                const [newTag] = await trx('theme').insert({ name: tagName }).returning('id')
                tagIds.push(newTag)
              }
            }
          
            // Create event and connect to tags
            const [newEvent] = await trx('event').insert({
              organizer_id: eventData.organizer_id,
              title: eventData.title,
              description: eventData.description,
              seat: eventData.seat,
              price: eventData.price,
              event_datetime: eventData.event_datetime,
              format: eventData.format,
              location: eventData.location,
              eve_pic: eventData.eve_pic
            }).returning('id')
          

            for (const tagId of tagIds) {
                console.log(tagId,newEvent)
              await trx('event_theme').insert({
                event_id: newEvent.id,
                theme_id: tagId.id
              })
            }
          })
          return newEvent
        }
}