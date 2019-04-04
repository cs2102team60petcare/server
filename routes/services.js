var express = require('express')
var router = express.Router()
var servicesController = require('../controllers/servicesController')

router.get('/', servicesController.getServicesPage)

module.exports = router
