const jwt = require('jsonwebtoken')
const {secret_access} = require('../config')
module.exports = function(req,res, next){
    if(req.method === "OPTIONS"){
        next()
    }
    try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"User is not authorized"})
        }
        const decodeData = jwt.verify(token, secret_access)
        req.user = decodeData
        next()
    }catch(e){
        console.log(e)
        return res.status(401).json({message:"User is not authorized" })
    }
}