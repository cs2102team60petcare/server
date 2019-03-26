var express = require('express')
var router = express.Router()
var signUpController = require('../controllers/signupController')

router.get('/', signUpController.signUp)

router.post('/', function (req, res, next) {
  console.log(req.body)
  return res.status(200).json(req.body)
})

module.exports = router
