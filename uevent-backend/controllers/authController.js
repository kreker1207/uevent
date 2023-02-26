const db = require('knex')(require('../knexfile'));
const USERS_TABLE = 'users'
const ROLE_TABLE = 'role'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('../config')


const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload,secret,{expiresIn:"1h"})
}

class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req)
            if(! errors.isEmpty()){
                return res.status(400).json({message:"Error during registration"})
            }
            console.log('registration')
            const {login, password,email} = req.body
            const candidate = await db(USERS_TABLE).select('*').where('login',login).orWhere('email',email).first()
            if(candidate){
                return res.status(400).json({message:"User with this login/email already exist"})
            }
            const userRole = await db(ROLE_TABLE).select('*').where('value','USER').first()
            const hashedPassword = bcrypt.hashSync(password,8)
            const user = {
                login: login,
                password: hashedPassword,
                email: email,
                role: userRole.value
            }
            await db(USERS_TABLE).insert(user)
            .then((result)=>{console.log(`Inserted ${result.rowCount} new user`)})
            .catch((error)=>{console.error(`Error inserting new user:`, error)})
            return res.json({user})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }

    }
    async login(req, res){
        try{
            const {login,password} = req.body
            const user = await db(USERS_TABLE).select().where('login',login).first()
            if(!user){
                return res.status(400).json({message:`User with ${login} not found`})
            }
            const validPassword = bcrypt.compareSync(password,user.password)
            if (!validPassword){
                return res.status(400).json({message: `Wrong password`})
            }
            const token = generateAccessToken(user._id, user.role)
            console.log(token)
            res.cookie('token', token.toString(), {
                maxAge: 60 * 60 * 1000,
                httpOnly: true, 
                credentials: "include"
              });
            res.send(`Logged in!`);

        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }

    }
    async refresh(req, res){
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, secret, { ignoreExpiration: true });
            if (decoded.exp > Date.now()) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const newToken = generateAccessToken(decoded._id,decoded.role)
            res.cookie('token', newToken.toString(), {
                maxAge: 60 * 60 * 1000,
                httpOnly: true, 
                credentials: "include"
              });
            return res.json({ token: newToken });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = new authController()