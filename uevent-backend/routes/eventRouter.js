const Router = require('express')
const router = new Router()
const controller = require('../controllers/eventController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/events/:page(\\d+)?', controller.getEvents);
router.get('/event/:id',controller.getEventById);
router.get('/event/user/:userId/:page(\\d+)?',controller.getEventByUserId);
//get bought

router.post('/org/:orgId/events',authMiddleware, controller.createEvent);
router.delete('/events/:id',authMiddleware,controller.deleteEvent);
module.exports = router