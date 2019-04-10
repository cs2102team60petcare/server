var express = require('express')
var router = express.Router()
var caretakerprofileController = require('../controllers/caretakerprofilecontroller')

router.put('/updateTaskFinished', caretakerprofileController.updateTaskFinished)
router.put('/acceptBid', caretakerprofileController.acceptBid)
router.put('/rejectBid' , caretakerprofileController.rejectBid)
router.post('/addService', caretakerprofileController.offerService)
router.delete('/deleteService', caretakerprofileController.deleteService)
router.get('/', caretakerprofileController.getCareTakerProfile)

module.exports = router
