const Router = require('express')
const router = new Router()
const controller = require('../controllers/searchController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/events/search/:page(\\d+)?', controller.getEvents);
router.get('/search/:page(\\d+)?',controller.getEventsAndOrgs);
router.post('/filter/:page(\\d+)?',controller.getEventsFilter);

module.exports = router