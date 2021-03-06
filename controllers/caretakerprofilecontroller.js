const pool = require('../database/connection')
const queries = require('../database/queries')

exports.updateTaskFinished = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var taskID = req.body.Task_id
    var updated = true

    try {
      await client.query('BEGIN')
      await client.query(queries.finishTaskUpdate, [taskID])
      await client.on('notice', function (msg) {
        console.log(msg)
        updated = false
      })
      if (updated == true) {
        await client.query('COMMIT')
      } else {
        await client.query('ROLLBACK')
      }
      res.json({ 'Updated': updated })
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}
exports.acceptBid = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var bidID = req.body.Bid_id
    var serviceID = req.body.Service_id
    try {
      await client.query('BEGIN')
      await client.query(queries.acceptBidUpdate1, [serviceID])
      await client.query(queries.acceptBidUpdate2, [bidID])
      await client.query(queries.acceptBidUpdate3, [bidID, serviceID])
      await client.query(queries.acceptBidUpdate4, [bidID])
      await client.query('COMMIT')
      console.log('Commited event with error detected 2')

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
    var bidID = req.body.Bid_id
    try {
      await client.query(queries.rejectBidUpdate, [bidID])
      res.json({ 'Updated': true })
    } catch (e) {
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
    var serviceID = req.body.Service_id
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
      const reviews = await client.query(queries.getMyReviews, [userID])
      const cumulativeIncome = await client.query(queries.perDayCumulativeSumQuery, [userID, 0, 20])
      Promise.all([upcomingTasks, tasksHistory, services, pendingBids, reviews, cumulativeIncome]).then((data) => {
        var upcomingTasksData = data[0]
        var tasksHistoryData = data[1]
        var servicesData = data[2]
        var pendingBidsData = data[3]
        var reviewsData = data[4]
        var graphData = data[5]
        console.log(graphData)

        res.render('caretaker', {
          upcomingTasks: upcomingTasksData.rows,
          tasksHistory: tasksHistoryData.rows,
          services: servicesData.rows,
          bids: pendingBidsData.rows,
          reviews: reviewsData.rows,
          graphDataValues: graphData.rows
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
