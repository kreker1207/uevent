const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = function(roles){
    return function (req,res,next){
        if(req.method === "OPTIONS"){
            next()
        }
        try{
            const token = req.cookies.token;
            if(!token){
                return res.status(401).json({message:"User is not authorized"})
            }
            console.log(roles)
            const {roles: userRoles = []} = jwt.verify(token,secret)
            let hasRole = false
            console.log(userRoles)
            userRoles.forEach(role => {
                if(roles.includes(role)){
                    hasRole = true
                }
            })
            if(!hasRole){
                return res.status(403).json({message: "You have no rights"})
            }
            next()
        }catch(e){
            console.log(e)
            return res.status(403).json({message:"User is not authorized" })
        }
    }
}