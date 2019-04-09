const pool = require('../database/connection')
const queries = require('../database/queries')

exports.acceptBid = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var bidID = req.body.Bid
    var serviceID = req.body.Sid
    try {
      await client.query('BEGIN')
      await client.query(queries.acceptBidUpdate1, [serviceID])
      await client.query(queries.acceptBidUpdate2, [bidID])
      await client.query(queries.acceptBidUpdate3, [bidID, serviceID])
      await client.query(queries.acceptBidUpdate4, [bidID])
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

exports.rejectBid = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var bidID = req.body.Bid
    try {
      await client.query('BEGIN')
      await client.query(queries.rejectBidUpdate, [bidID])
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
exports.offerService = function (req, res, next) {
  (async () => {
    console.log(req.body)
    console.log(req.user)
    const client = await pool.connect()
    var caretakerID = req.user.user_id
    var starting = req.body.starting
    var ending = req.body.ending
    var minWage = req.body.minwage

    try {
      await client.query('BEGIN')
      await client.query(queries.offerServiceInsert, [caretakerID, starting, ending, minWage])
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

exports.deleteService = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var serviceID = req.body.Sid
    console.log(serviceID)
    try {
      await client.query('BEGIN')
      await client.query(queries.removeServiceUpdate1, [serviceID])
      await client.query(queries.removeServiceUpdate2, [serviceID])
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
exports.getCareTakerProfile = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    console.log(req.user)
    var userID = req.user.user_id
    try {
      const upcomingTasks = await client.query(queries.getMyUpcomingTasksQuery, [userID])
      const tasksHistory = await client.query(queries.getMyTaskHistoryQuery, [userID])
      const services = await client.query(queries.getMyAvailableServicesQuery, [userID])
      const pendingBids = await client.query(queries.getPendingBidsForMeQuery, [userID])
      Promise.all([upcomingTasks, tasksHistory, services]).then((data) => {
        var upcomingTasksData = data[0]
        var tasksHistoryData = data[1]
        var servicesData = data[2]

        res.render('caretaker', {
          upcomingTasks: upcomingTasksData.rows,
          tasksHistory: tasksHistoryData.rows,
          services: servicesData.rows,
          bids: pendingBids.rows
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
