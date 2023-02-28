const   db = require('knex')(require('../knexfile')),
        USERS_TABLE = 'users',
        ROLE_TABLE = 'role',
        bcrypt = require('bcryptjs'),
        jwt = require('jsonwebtoken'),
        {validationResult} = require('express-validator'),
        {secret_access, secret_refresh} = require('../config'),
        Mailer = require('../middleware/mailer');
//

const mailer = new Mailer();


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
            console.log('registration');

            const {login, password, email} = req.body
            const candidate = await db(USERS_TABLE).select('*')
                .where('login',login)
                .orWhere('email', 'like', `%${email}%`)
                .first()
            if(candidate){
                if(candidate.login === login)
                    return res.status(400).json({message:"User with this login already exist"});
                return res.status(400).json({message:"User with this email already exist"});
            }

            const userRole = await db(ROLE_TABLE).select('*').where('value','USER').first()
            const hashedPassword = bcrypt.hashSync(password,8)
            const user = {
                login: login,
                password: hashedPassword,
                email: 'unconfirmed@@' + email,
                role: userRole.value
            }

            await db(USERS_TABLE).insert(user)
            .then((result)=>{console.log(`Inserted ${result.rowCount} new user`)})
            .catch((error)=>{console.error(`Error inserting new user:`, error)})

            // Move all token stuff to another file
            mailer.sendConfirmEmail(email, jwt.sign({
                email: email,
                login: login
            }, secret_access, {expiresIn: '1h'}))

            return res.json({user})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }

    }

    async confirmEmail(req, res) {
        try{
            const {token} = req.params;
            const payload = jwt.verify(token, secret_access);
            await db(USERS_TABLE).select('*')
                .where('login', payload.login)
                .update({email: payload.email});
            res.status(200).json({message: 'Email confirmed successfuly!'});
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Email confirmation error'})
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
            const accessToken = generateAccessToken(user,"15m")
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
                const accessToken = generateAccessToken(decoded, "15m")
                return res.status(200).json({...decoded, password: '', accessToken});
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async logout (req, res) {
        if(!req.cookies.refreshToken) 
            res.status(401).json({message: "Unauthorised"});
        else 
            res.status(200).clearCookie('refreshToken', {path: '/'}).json({message: "Logged out"});
    }

    
}
module.exports = new authController()