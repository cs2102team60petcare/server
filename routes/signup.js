var express = require('express')
var router = express.Router()
var signUpController = require('../controllers/signupController')
const pool = require('../database/connection')
const queries = require('../database/queries')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/', signUpController.signUp)

router.post('/', function (req, res, next) {
  
  // NEED address, and phone number @kevin
  // replace hardcode in pool.query line below to req.body.phone (numeric) and req.body.address (in json)

  //DO INPUT VALIDATION @teojunjie 
  	//valid value on all fields
  	//use userExistsQuery. if data.rows.length != 0, REJECT
  	//similarly, gotta check all unique fields in USERS. Please see init_petcare.sql

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      pool.query(queries.signupUserInsert, [req.body.username, req.body.email, 019379123, '{}', hash], (err, res1) => {
      	if (err) { 
      		console.log(err) 
      	} else {
      		return res.status(200).json(req.body) 
      		//res.redirect('/home')
      	}
      })
    })
  })
})

module.exports = router
