const Router = require('express')
const router = new Router()
const controller = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.get('/users', controller.get)
router.get('/users/:id',controller.getById)
router.post('/users', controller.edit);
router.delete('/users/:id',authMiddleware,controller.deleteById)
module.exports = router