const Router = require('express')
const router = new Router()
const controller = require('../controllers/orgController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/org', controller.getOrgs);
router.get('/org/:id',controller.getOrgById);
router.get('/org/users/:userId',controller.getOrgsByUserId);

router.post('/org',authMiddleware, controller.createOrg);
router.post('/org/avatar/:id', controller.editAvatar);
router.put('/org/:id',authMiddleware, controller.editOrg);
router.delete('/org/:id',authMiddleware,controller.deleteOrg);
module.exports = router