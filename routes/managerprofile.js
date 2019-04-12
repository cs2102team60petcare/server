var express = require('express')
var router = express.Router()
var managerprofileController = require('../controllers/managerprofilecontroller')

router.post('/sendQuery', managerprofileController.sendQueryData)
router.put('/updateRequest', managerprofileController.updateRequest)
router.put('/selfAssignRequest', managerprofileController.selfAssignRequest)
router.put('/searchRequest', managerprofileController.searchRequest)
router.get('/', managerprofileController.getManagerProfile)

module.exports = router
