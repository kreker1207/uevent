const Router = require('express')
const router = new Router()
const controller = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/users', controller.get);
router.get('/users/avatar/:avatarName',controller.getAvatar);
router.get('/users/:id',controller.getById);

router.post('/users', controller.edit);
router.post('/users/avatar', controller.editAvatar);
router.delete('/users',authMiddleware,controller.delete);
module.exports = router