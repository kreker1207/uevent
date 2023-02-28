const db = require('knex')(require('../knexfile'));
const USERS_TABLE = 'users'
const ROLE_TABLE = 'role'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret_access, secret_refresh} = require('../config')


const generateAccessToken = (user, hours) => {
    const payload = {
        id:user._id,
        login:user.login,
        email:user.email,
        role:user.role
    }
    return jwt.sign(payload, secret_access, {expiresIn: hours})
}
const generateRefreshToken = (user, hours) => {
    const payload = {
        id:user._id,
        login:user.login,
        email:user.email,
        role:user.role
    }
    return jwt.sign(payload, secret_refresh, {expiresIn: hours})
}

class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req)
            if(! errors.isEmpty()){
                return res.status(400).json({message:"Error during registration"})
            }
            console.log('registration')
            const {login, password, email} = req.body
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
            const {login, password} = req.body
            console.log(login, password)
            const user = await db(USERS_TABLE).select().where('login',login).first()
            if(!user){
                return res.status(400).json({message:`User with ${login} not found`})
            }
            const validPassword = bcrypt.compareSync(password,user.password)
            if (!validPassword){
                return res.status(400).json({message: `Wrong password`})
            }
            const accessToken = generateAccessToken(user,"1m")
            const refreshToken = generateRefreshToken(user,"1d")
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 5184000,
                credentials: "include"
            });
            res.status(200).json({...user, accessToken, password: ''});
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }

    }

    async profile(req, res) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(refreshToken, secret_refresh, { ignoreExpiration: true });
            if (decoded.exp > Date.now()) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            try {
                jwt.verify(req.headers.authorization, secret_access)
                return res.status(200).json({...decoded});
            } catch (e) {
                const accessToken = generateAccessToken(decoded, "1m")
                return res.status(200).json({...decoded, password: '', accessToken});
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = new authController()