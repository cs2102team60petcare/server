var express = require('express')
var router = express.Router()

<<<<<<< HEAD
router.get('/', function(req, res) {
	req.logout()
	res.redirect('/login')
=======
router.get('/', function (req, res) {
  req.logout()
  res.redirect('/login')
>>>>>>> 86c1d3e4cec54df2bdcb3c4860a45d613120bf25
})

module.exports = router
