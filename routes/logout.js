var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
	req.logout()
	res.redirect('/home')
})

module.exports = router