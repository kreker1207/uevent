const   USERS_TABLE = 'users',
        User = require('../models/user'),
        Mailer = require('../middleware/mailer'),
        {CustomError, errorReplier} = require('../models/error');
//

class userController{
    async get(req,res){
        try{
            const user = new User(USERS_TABLE);
            const pawns = await user.getAll();
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get users';
            errorReplier(e, res);
        }
    }

    async getById(req,res){
        try{
            const user = new User(USERS_TABLE);
            const pawn = await user.getById(req.params.id);
            res.json(pawn)
        } catch(e){
            e.addMessage = 'Get user by id';
            errorReplier(e, res);
        }

    }

    async edit(req, res) {
        try{
            console.log(req);
            res.json('sosi')
        } catch(e){

        }
    }

    async deleteById(req,res){
        try{
            const user = new User(USERS_TABLE);
            const pawn = await user.del({id: req.params.id});
            res.json(pawn)
        } catch(e){
            e.addMessage = 'Delete user by id';
            errorReplier(e, res);
        }
    }

}
module.exports = new userController()