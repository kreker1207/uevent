const Entity = require('./entity');
const bcrypt = require('bcryptjs')
module.exports = class User extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async get(login, email){
        if (email) {
            return await super.table().select('*')
            .where('login', '=', login)
            .orWhere('email', 'like', `%${email}`)
            .first();
        }
        return super.get({login: login});
    }
    async updatePassword(userId, newPassword) {      
        const hash = await bcrypt.hash(newPassword, 8);
      
        return super.table()
          .where({ id: userId })
          .update({ password: hash })
          .returning('*');
      }
    async getAllOrganizationsByUserId (userId){
        if(userId){
        return await super.table()
          .join('organization', 'users.id', '=', 'organization.admin_id')
          .select('organization.id', 'organization.title', 'organization.description', 'organization.location')
          .where('users.id', userId);
    
        }else return [];
      };
}
