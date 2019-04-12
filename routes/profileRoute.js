var express = require('express')
var router = express.Router()
var profileController = require('../controllers/profileController')

router.get('/', profileController.getUserProfilePage)
router.post('/updateProfile', profileController.updateProfile)

module.exports = router
