module.exports = class Comment extends Entity {
    constructor(tableName) {
        super(tableName);
    }
    async existThemeByName(name){
        if(name){
            super.table().where({ login: login })
            .select('id')
            .then(rows => {
                const userExists = rows.length > 0
                return userExists
            })
        }

    }
}