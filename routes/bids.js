var express = require('express')
var router = express.Router()
var bidsController = require('../controllers/bidsController')

router.get('/', bidsController.getBidsPage)

module.exports = router
