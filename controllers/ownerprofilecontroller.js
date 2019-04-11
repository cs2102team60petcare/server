const pool = require('../database/connection')
const queries = require('../database/queries')

exports.addBid = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var starting = req.body.starting
    var ending = req.body.ending
    var money = req.body.money
    var ownerID = req.user.user_id
    var petID = req.body.pet_id
    var serviceID = req.body.service_id
    console.log(req.body)
    console.log(ownerID)
    try {
      await client.query('BEGIN')
      await client.query(queries.placeBidInsert, [starting, ending, money, ownerID, petID, serviceID])
      await client.query('COMMIT')
      res.json({ 'Updated': true })
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.log(e.stack))
}

exports.deleteBid = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var ownerID = req.user.user_id
    var bidID = req.body.bid_id
    var serviceID = req.body.service_id
    console.log(req.body)
    console.log(ownerID)
    console.log(bidID)
    console.log(serviceID)

    try {
      await client.query('BEGIN')
      await client.query(queries.retractBidUpdate1, [bidID])
      await client.query(queries.retractBidUpdate2, [ownerID, serviceID])
      await client.query(queries.retractBidUpdate3, [serviceID])
      await client.query(queries.retractBidUpdate4, [bidID])
      await client.query('COMMIT')
      res.json({ 'Updated': true })
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

exports.addPet = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var name = req.body.pet_name
    var biography = req.body.pet_information
    var type = req.body.pet_type
    var born = req.body.pet_born
    var userID = req.user.user_id
    console.log(req.body)
    try {
      await client.query('BEGIN')
      const { rows } = await client.query(queries.signupPetInsert, [name, type, biography, born])
      console.log(rows)
      const ownsPetValues = [rows[0].pet_id, userID, new Date()]
      await client.query(queries.ownsPetInsert, ownsPetValues)
      await client.query('COMMIT')
      res.json({ 'Updated': true })
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

exports.updatePet = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var petID = req.body.Pid
    var newPetName = req.body.Name
    var newPetBiography = req.body.Bio
    console.log(req.body)
    try {
      await client.query(queries.petProfileUpdate, [newPetName, newPetBiography, petID])
      res.json({ 'Updated': true })
    } catch (e) {
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

exports.deletePet = function (req, res, next) {
  console.log(req.body)
  res.json({ 'Updated': true })
}

exports.getOwnerProfile = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var userID = req.user.user_id
    try {
      const pets = await client.query(queries.getMyPetsQuery, [userID])
      const bids = await client.query(queries.seeMyBidsQuery, [userID])
      const tasks = await client.query(queries.getMyTaskHistoryAsOwnerQuery, [userID])
      var demand1 = await client.query(queries.ratioOfTaskByHourByDay, [1])
      var demand2 = await client.query(queries.ratioOfTaskByHourByDay, [2])
      var demand3 = await client.query(queries.ratioOfTaskByHourByDay, [3])
      var demand4 = await client.query(queries.ratioOfTaskByHourByDay, [4])
      var demand5 = await client.query(queries.ratioOfTaskByHourByDay, [5])
      var demand6 = await client.query(queries.ratioOfTaskByHourByDay, [6])
      var demand7 = await client.query(queries.ratioOfTaskByHourByDay, [7])
      Promise.all([pets, bids, tasks, demand1, demand2, demand3, demand4, demand5, demand6, demand7]).then((data) => {
        var petsData = data[0]
        var bidsData = data[1]
        var tasksData = data[2]
        var graphData = data[3].rows.concat(data[4].rows, data[5].rows, data[6].rows, data[7].rows, data[8].rows, data[9].rows)

        console.log(graphData)
        res.render('ownerprofile', {
          bids: bidsData.rows,
          pets: petsData.rows,
          tasks: tasksData.rows,
          graphDataValues: graphData
        })
      }).catch(err => {
        console.log(err)
        res.status(500)
      })
    } catch (e) {
      res.redirect('./login')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}
