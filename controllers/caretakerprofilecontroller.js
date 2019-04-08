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
      await client.query(queries.acceptBidUpdate3, [serviceID])
      await client.query(queries.acceptBidUpdate4, [bidID])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      res.status(401).json({ 'Updated': false })
      throw e
    } finally {
      client.release()
      res.status(401).json({ 'Updated': true })
    }
  })().catch(e => console.error(e.stack))
}

exports.offerService = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var caretakerID = req.user.user_id
    var starting = req.body.Starting
    var ending = req.body.Ending
    var minWage = req.body.Minwage

    try {
      await client.query('BEGIN')
      await client.query(queries.offerServiceInsert, [caretakerID, starting, ending, minWage])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      res.status(401).json({ 'Updated': false })
      throw e
    } finally {
      client.release()
      res.status(401).json({ 'Updated': true })
    }
  })().catch(e => console.error(e.stack))
}

exports.deleteService = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var serviceID = req.body.Sid
    try {
      await client.query('BEGIN')
      await client.query(queries.removeServiceUpdate1, [serviceID])
      await client.query(queries.removeServiceUpdate2, [serviceID])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      res.status(401).json({ 'Updated': false })
      throw e
    } finally {
      client.release()
      res.status(401).json({ 'Updated': true })
    }
  })().catch(e => console.error(e.stack))
}
exports.getCareTakerProfile = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    console.log(req.user)
    var userID = req.user.user_id
    try {
      await client.query('BEGIN')
      const upcomingTasks = await client.query(queries.getMyUpcomingTasksQuery, [userID])
      const tasksHistory = await client.query(queries.getMyTaskHistoryQuery, [userID, 0, 5])
      const services = await client.query(queries.getMyServicesQuery, [userID])
      Promise.all([upcomingTasks, tasksHistory, services]).then((data) => {
        var upcomingTasksData = data[0]
        var tasksHistoryData = data[1]
        var servicesData = data[2]

        res.render('caretaker', {
          upcomingTasks: upcomingTasksData.rows,
          tasksHistory: tasksHistoryData.rows,
          services: servicesData.rows,
          bids: [
            {
              bids_id: 1,
              pet_id: 2,
              owner_id: 3,
              service_id: 2,
              money: 20,
              status: 'Successful',
              starting: '12/3/18',
              ending: '9/2/20'
            }
          ]
        })
      }).catch(err => {
        console.log(err)
        res.status(500)
      })
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      res.redirect('./login')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}
