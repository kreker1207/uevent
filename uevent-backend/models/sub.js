const Entity = require('./entity');

module.exports = class Subscription extends Entity {
    constructor(tableName) {
        super(tableName);
    }
    async getEvents(user_id) {
        return await super.table()
        .select('event_id', 'event.title')
        .from('sub').where({user_id: user_id})
        .join('event', 'sub.event_id', '=', 'event.id');
    }
}