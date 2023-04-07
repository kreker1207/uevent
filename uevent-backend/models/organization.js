const Entity = require('./entity');

module.exports = class Organization extends Entity {
    constructor(tableName) {
        super(tableName);
    }
}