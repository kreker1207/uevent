const Entity = require('./entity');

module.exports = class Tag extends Entity {
    constructor(tableName) {
        super(tableName);
    }
    async getAllSorted(){
        return await super.table().select('*').orderBy('name', 'asc')
    }
}