const Entity = require('./entity');

module.exports = class Purchase extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async getUsers(event_id) {
        return await super.table()
        .select('purchase.id', 'users.id AS user_id', 'users.profile_pic')
        .from('purchase')
        .join('users', 'purchase.user_id', '=', 'users.id')
        .where({event_id: event_id, status: true});
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