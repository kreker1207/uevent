const Router = require('express')
const router = new Router()
const controller = require('../controllers/purchaseController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/buy',authMiddleware, controller.Buy);

module.exports = router