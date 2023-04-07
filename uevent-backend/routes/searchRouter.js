const Router = require('express')
const router = new Router()
const controller = require('../controllers/searchController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/events/search', controller.getEvents);
router.get('/search',controller.getEventsAndOrgs);

module.exports = router