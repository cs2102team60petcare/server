var express = require('express')
var router = express.Router()
var signUpController = require('../controllers/signupController')

router.get('/caretaker', signUpController.getSignUpCareTakerPage)

router.post('/caretaker', signUpController.signUpCareTaker)
 
router.get('/owner', signUpController.getSignUpOwnerPage)

router.post('/owner', signUpController.signUpOwner)

module.exports = router
