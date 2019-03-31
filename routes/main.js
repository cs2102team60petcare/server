var express = require('express')
var router = express.Router()
var mainController = require('../controllers/mainController')
var loginRoute = require('./login')
var logoutRoute = require('./logout')
var homeRoute = require('./home')
var signUpRoute = require('./signup')
const pool = require('../database/connection')


router.use('/login', loginRoute)
router.use('/home', homeRoute)
router.use('/signup', signUpRoute)
router.use('/logout', logoutRoute)

const loggedInOnly = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect("/login");
};

router.get('/', mainController.getMainPage)

router.get('/profile' , loggedInOnly, function(req, res, next) {
    res.render('profile')
})

router.get('/bids', function(req, res, next) { 
  pool.query("SELECT * FROM bids", (err, data) => {
    if (err) next(err)
    var databids = data.rows
    res.render('bids', {bids : databids})
    // res.render('bids',{ bids: [
    //   { "oid": 1,
    //     "starttime": "30/03/2019 1130",
    //     "endtime":  "31/03/2019 2340" ,
    //     "bidplaced": 20,
    //     "status": 1
    //   },
  
    //   { "oid": 2,
    //   "starttime": "30/03/2019 1330",
    //   "endtime": "31/03/2019 2340" ,
    //   "bidplaced": 25,
    //   "status": 1
    //   } ] 
    // });
  
  })

})

router.get('/services',function (req, res, next) {
  pool.query("SELECT * FROM services" , (err, data) => {
    if (err) next (err)
    var servicesData = data.rows
    console.log(servicesData)
    res.render('servicesPage', {service : servicesData})
    // res.render('servicesPage', {service: [
    //   { sid: 1, petType: 'Dog' ,startDate: 310319 ,endDate: 090419, minWage: 20},
    //   { sid: 2, petType: 'Cat' ,startDate: 310319 ,endDate: 100419, minWage: 15},
    //   { sid: 3, petType: 'Snake' ,startDate: 310319 ,endDate: 110419, minWage: 1500}
    //   ]})
    
  })
})

module.exports = router