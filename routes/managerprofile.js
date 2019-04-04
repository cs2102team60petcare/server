var express = require('express')
var router = express.Router()
var managerprofileController = require('../controllers/managerprofilecontroller')

router.get('/', managerprofileController.getManagerProfile)

module.exports = router