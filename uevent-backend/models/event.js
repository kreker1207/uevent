const Entity = require('./entity');

module.exports = class Event extends Entity {
    constructor(tableName) {
        super(tableName);
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
}