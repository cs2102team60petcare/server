var express = require('express')
var router = express.Router()
var loginController = require('../controllers/loginController')

router.get('/' , loginController.getLoginPage)

router.post('/login', loginController.login)


module.exports = router