const Entity = require('./entity');

module.exports = class Purchase extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    /*async get(searchObj) {
        return await super.table()
        .select('purchase.id', 'status', 'users.login', 'users.email',
        'event.title', 'event.event_datetime', 'event.location')
        .from('purchase')
        .join('event', 'purchase.event_id', '=', 'event.id')
        .join('users', 'purchase.user_id', '=', 'users.id')
        .where(searchObj);
    }*/

    async set(setObj, edit = false) {
        if (edit) {
            return await this.table().returning('*').where({id: setObj.id}).update(setObj)
            .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
        }
        return await this.table().returning('*').insert(setObj)
        .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
    }
}