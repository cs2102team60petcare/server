const pool = require('../database/connection')
const queries = require('../database/queries')

exports.updateRequest = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var requestID = req.body.Request_id
    var justification = req.body.Message

    try {
      await client.query('BEGIN')
      await client.query(queries.requestSolvedUpdate1, [requestID])
      await client.query(queries.reqestSolvedUpdate2, [justification, requestID])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      res.json({ 'Updated': true })
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

exports.selfAssignRequest = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var requestID = req.body.requestID
    var managerID = req.user.user_id

    try {
      await client.query('BEGIN')
      await client.query(queries.assignRequestToMe1, [requestID])
      await client.query(queries.assignRequestToMe2, [managerID, requestID])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      res.json({ 'Updated': true })
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

exports.getManagerProfile = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var userID = req.user.user_id
    try {
      await client.query('BEGIN')
      const requests = await client.query(queries.getRequestsAssignedToMe, [userID, 0, 5])
      const unassignedRequests = await client.query(queries.getUnassignedRequests)

      Promise.all([requests, unassignedRequests]).then((data) => {
        var requestsData = data[0]
        var unassignedRequestsData = data[1]

        res.render('managerprofile', {
          requests: requestsData.rows,
          unassignedRequests: unassignedRequestsData.rows
        })
      }).catch(err => {
        console.log(err)
        res.status(500)
      })
      await client.query('COMMIT')
    } catch (e) {
      // @TODO
      // If got error , it means that user is not a manager, should be redirected to somwhere else
      await client.query('ROLLBACK')
      res.redirect('./login')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}
