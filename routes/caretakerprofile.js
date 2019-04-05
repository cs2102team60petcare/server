var express = require('express')
var router = express.Router()
var caretakerprofileController = require('../controllers/caretakerprofilecontroller')

router.get('/', caretakerprofileController.getCareTakerProfile)

module.exports = router
