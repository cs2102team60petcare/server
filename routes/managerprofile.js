var express = require('express')
var router = express.Router()
var managerprofileController = require('../controllers/managerprofilecontroller')

router.put('/updateRequest', managerprofileController.updateRequest)
router.put('/selfAssignRequest', managerprofileController.selfAssignRequest)
router.get('/', managerprofileController.getManagerProfile)

module.exports = router
