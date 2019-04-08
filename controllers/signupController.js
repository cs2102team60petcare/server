const pool = require('../database/connection')
const queries = require('../database/queries')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.getSignUpCareTakerPage = function (req, res, next) {
  res.render('signupCareTaker', { title: 'Sign up for PetCare as a CareTaker' })
}

exports.signUpCareTaker = function (req, res, next) {
  var name = req.body.username
  var email = req.body.email
  var password = req.body.password
  var address = '{ "address" :' + '"' + req.body.address + '"' + '}'
  var number = req.body.number
  var petType = [req.body.petType]

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) next(err)
    bcrypt.hash(password, salt, function (err2, hash) {
      if (err2) { next(err2) }
      (async () => {
        const client = await pool.connect()
        console.log(petType)
        try {
          await client.query('BEGIN')
          const { rows } = await client.query(queries.signupUserInsert, [name, email, number, address, hash])
          var userID = rows[0].user_id
          await client.query(queries.signupCareTakerInsert, [userID])
          await client.query(queries.careTakerLikesInsert, [userID, petType])
          await client.query('COMMIT')
        } catch (e) {
          await client.query('ROLLBACK')
          throw e
        } finally {
          client.release()
          res.redirect('../login')
        }
      })().catch(e => console.error(e.stack))
    })
  })
}

exports.getSignUpOwnerPage = function (req, res, next) {
  res.render('signupOwner', { title: 'Sign up for Percare as an Owner' })
}

exports.signUpOwner = function (req, res, next) {
  var name = req.body.username
  var email = req.body.email
  var password = req.body.password
  var address = '{ "address" :' + '"' + req.body.address + '"' + '}'
  console.log(address)
  var number = req.body.number

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) next(err)
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) { next(err) }
      (async () => {
        const client = await pool.connect()

        try {
          await client.query('BEGIN')
          const { rows } = await client.query(queries.signupUserInsert, [name, email, number, address, hash])
          console.log(rows)
          const insertOwnerValues = [rows[0].user_id]
          await client.query(queries.signupOwnerInsert, insertOwnerValues)
          res.redirect('../ownerprofile')
          await client.query('COMMIT')
        } catch (e) {
          await client.query('ROLLBACK')
          res.redirect('../signup')
          throw e
        } finally {
          client.release()

        }
      })().catch(e => setImmediate(() => { throw e }))
    })
  })
}

// DO INPUT VALIDATION @teojunjie
  	// valid value on all fields
  	// use userExistsQuery. if data.rows.length != 0, REJECT
  	// similarly, gotta check all unique fields in USERS. Please see init_petcare.sql
