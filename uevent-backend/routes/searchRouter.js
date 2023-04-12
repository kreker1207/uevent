const Router = require('express')
const router = new Router()
const controller = require('../controllers/searchController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/events/search', controller.getEvents);
router.get('/search',controller.getEventsAndOrgs);
router.get('/filter/:page(\\d+)?',controller.getEventsFilter);

module.exports = router