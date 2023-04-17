const Entity = require('./entity');

module.exports = class Purchase extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async getUsers(event_id) {
        return await super.table()
        .select('purchase.id', 'users.id AS user_id','users.email AS email', 'users.profile_pic')
        .from('purchase')
        .join('users', 'purchase.user_id', '=', 'users.id')
        .where({event_id: event_id, status: true});
    }

    async getRemaining(event_id, seat_count) {
        const {count} = await super.table()
        .where({event_id: event_id, status: true})
        .count('*').first();
        console.log(seat_count + ' - ' + count)
        return seat_count - count;
    }

    async getEvents(user_id) {
        return await super.table()
        .select('purchase.id', 'event.id AS event_id', 'event.title AS title',
        'event.description as description', 'event.event_datetime as event_datetime',
        'event.location as location', 'event.eve_pic')
        .from('purchase')
        .join('event', 'purchase.event_id', '=', 'event.id')
        .where({user_id: user_id, status: true});
    }

    async set(setObj, edit = false) {
        if (edit) {
            return await this.table().returning('*').where({id: setObj.id}).update(setObj)
            .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
        }
        return await this.table().returning('*').insert(setObj)
        .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
    }
}