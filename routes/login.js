var express = require('express')
var router = express.Router()
var utilities = require('../controllers/utilities')
var loginController = require('../controllers/loginController')

router.get('/', utilities.notLoggedInOnly, loginController.getLoginPage)

router.post('/', utilities.notLoggedInOnly, loginController.login)

module.exports = router
