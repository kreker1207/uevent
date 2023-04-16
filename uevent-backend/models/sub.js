const Entity = require('./entity');

module.exports = class Subscription extends Entity {
    constructor(tableName) {
        super(tableName);
    }
}