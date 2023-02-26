const Router = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', [
    check('login',"Login could not be empty").notEmpty(),
    check('password', "Password should be no less than 4 and no longer that 16").isLength({min:4,max:16}),
    check('email',"Not valid email").isEmail()
] ,controller.registration)
router.post('/login',controller.login)
router.post('/refresh-token', controller.refresh)

module.exports = router