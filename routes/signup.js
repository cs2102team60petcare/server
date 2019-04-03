var express = require('express')
var router = express.Router()
var utilities = require('../controllers/utilities')
var signUpController = require('../controllers/signupController')

router.get('/caretaker', utilities.notLoggedInOnly, signUpController.getSignUpCareTakerPage)

router.post('/caretaker', signUpController.signUpCareTaker)
 
router.get('/owner', utilities.notLoggedInOnly, signUpController.getSignUpOwnerPage)

router.post('/owner', signUpController.signUpOwner)

module.exports = router
