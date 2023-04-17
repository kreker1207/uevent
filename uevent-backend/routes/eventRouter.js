const Router = require('express')
const router = new Router()
const controller = require('../controllers/eventController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/events/:page(\\d+)?', controller.getEvents);
router.get('/event/:id',controller.getEventById);
router.get('/event/user/:userId/:page(\\d+)?',controller.getEventByUserId);
router.get('/event/org/:orgId/:page(\\d+)?',controller.getEventByOrgId);
router.get('/event/:id/buyers', controller.getBuyers);
router.get('/event/:id/seats', controller.getSeats);
router.get('/tags',controller.getTags);
//get bought
router.post('/events/:id/sub', controller.setSub);

router.post('/events/avatar/:id', controller.editAvatar);
router.post('/event/edit/:id',authMiddleware,controller.editEvent);
router.post('/org/:orgId/events',authMiddleware, controller.createEvent);
router.delete('/events/:id',authMiddleware,controller.deleteEvent);
module.exports = router