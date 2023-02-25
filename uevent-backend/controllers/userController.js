const db = require('knex')(require('../knexfile'));
const USERS_TABLE = 'users'


class userController{
    async getUsers(req,res){
        try{
            const users = await db('users').select()
            res.json(users)
        }catch(e){
            console.log(e)
        }
    }
    async getUserById(req,res){
        try{
            const user = await db(USERS_TABLE).select().where('id',req.params.id).first()
            res.json(user)
        }catch(e){
            console.log(e)
        }

    }
    async deleteUserById(req,res){
        try{
            const deleteUser = await db('users').where('id', req.params.id).del()
            res.json(deleteUser)
        }catch(e){
            console.log(e)
        }
    }

}
module.exports = new userController()