const  db = require('knex')(require('../db/knexfile'));

module.exports = class Entity {
    constructor(tableName) {
        this.tableName = tableName;
    }

    table () {
        return db(this.tableName)
    }

    async get(searchObj, isAll = false) {
        const result =  await this.table().select('*').where(searchObj);
        if (isAll) return result;
        else return result[0];
    }

    // i guess it d be better to delete this
    async getById(id) {
        return await this.get({id})
    }

    async getAll() {
        return await this.get({}, true);
    }

    async set(setObj) {
        return await this.table().insert(setObj).onConflict('id').merge(setObj)
        .then((result)=>{console.log(`Inserted ${result.rowCount} into ${this.tableName}`)})
        .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error)});
    }

    async del(searchObj) {
        return await this.table().where(searchObj).del();
    }
}