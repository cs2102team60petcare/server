const pool = require('../database/connection')
const queries = require('../database/queries')

exports.addBid = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.updateBid = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.deleteBid = function (req, res, next) {
  res.json({ 'Updated': true })
}

exports.addPet = function (req, res, next) {
  console.log(req.body)
  if (req.user) {
    (async () => {
      const client = await pool.connect()
      var name = req.body.pet_name
      var biography = req.body.pet_information
      var type = req.body.pet_type
      var born = req.body.pet_born
      var userID = req.user.user_id
      try {
        await client.query('BEGIN')
        const { rows } = await client.query(queries.signupPetInsert, [name, type, biography, born])
        const ownsPetValues = [rows[0].pet_id, userID, new Date()]
        await client.query(queries.ownsPetInsert, ownsPetValues)
        await client.query('COMMIT')
      } catch (e) {
        await client.query('ROLLBACK')
        throw e
      } finally {
        client.release()
        res.json({ 'Updated': true })
      }
    })().catch(e => console.error(e.stack))
  } else {
    res.json({ 'Updated': false })
  }
}

exports.updatePet = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.deletePet = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.getOwnerProfile = function (req, res, next) {
  if (req.user) {
    (async () => {
      const client = await pool.connect()
      var userID = req.user.user_id
      console.log(userID)
      try {
        await client.query('BEGIN')
        const pets = await client.query(queries.getMyPetsQuery, [userID])
        const bids = await client.query(queries.getAllBids)
        const tasks = await client.query(queries.getMyTaskHistoryQuery, [userID, 0, 5])

        Promise.all([pets, bids, tasks]).then((data) => {
          console.log('Promised handled')
          var petsData = data[0]
          var bidsData = data[1]
          var tasksData = data[2]
          
          console.log(petsData.rows)
          console.log(bidsData.rows)
          console.log(tasksData.rows)

          res.render('ownerprofile', {
            bids: bidsData.rows,
            pets: petsData.rows,
            tasks: tasksData.rows
          })
        }).catch(err => {
          console.log(err)
          res.status(500)
        })

      } catch (e) {
        await client.query('ROLLBACK')
        throw e
      } finally {
        client.release()


      }
    })().catch(e => console.error(e.stack))
  }
  else {
    res.redirect('./login')
  }
}
