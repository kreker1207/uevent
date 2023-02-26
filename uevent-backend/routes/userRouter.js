const Router = require('express')
const router = new Router()
const controller = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.get('/users', controller.getUsers)
router.get('/users/:id',controller.getUserById)
router.delete('/users/:id',authMiddleware,controller.deleteUserById)
module.exports = router