const Router = require('express')
const router = new Router()
const controller = require('../controllers/commentController')
const authMiddleware = require('../middleware/authMiddleware')
//Not needed
router.get('/comments', controller.getComments);

router.get('/comments/event/:eventId',controller.getCommentsByEventId);

router.post('/comments/event/:eventId',authMiddleware, controller.createEventComment);
router.post('/comments/event/:eventId/reply/:comId',authMiddleware, controller.createReplyComment);
module.exports = router