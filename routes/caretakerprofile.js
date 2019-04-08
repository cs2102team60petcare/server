var express = require('express')
var router = express.Router()
var caretakerprofileController = require('../controllers/caretakerprofilecontroller')

router.post('/acceptBid', caretakerprofileController.acceptBid)
router.post('/addService', caretakerprofileController.offerService)
router.delete('/deleteService', caretakerprofileController.deleteService)
router.get('/', caretakerprofileController.getCareTakerProfile)

module.exports = router
