var express = require('express')
var router = express.Router()
var ownerprofileController = require('../controllers/ownerprofilecontroller')

router.get('/viewBid', ownerprofileController.viewBid)
router.post('/addBid', ownerprofileController.addBid)
router.delete('/deleteBid', ownerprofileController.deleteBid)
router.post('/addPet', ownerprofileController.addPet)
router.put('/updatePet', ownerprofileController.updatePet)
router.delete('/deletePet', ownerprofileController.deletePet)
router.get('/', ownerprofileController.getOwnerProfile)

module.exports = router
