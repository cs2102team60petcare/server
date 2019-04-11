const pool = require('../database/connection')
const queries = require('../database/queries')

exports.updateRequest = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    console.log(req.body)
    var requestID = req.body.Request_id
    var justification = req.body.Justification // send justification text

    try {
      await client.query('BEGIN')
      await client.query(queries.requestSolvedUpdate1, [requestID])
      await client.query(queries.requestSolvedUpdate2, [justification, requestID])
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

exports.selfAssignRequest = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var requestID = req.body.Rid // based on the header values
    var managerID = req.user.user_id
    console.log(req.body)
    try {
      await client.query('BEGIN')
      await client.query(queries.assignRequestToMe1, [requestID])
      await client.query(queries.assignRequestToMe2, [managerID, requestID])
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

exports.searchRequest = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    console.log(req.body)
    var managerID = req.user.user_id
    var requestID = req.body.search_RID
    var offsetNo = req.body.offset
    var showLimit = req.body.show
    if (requestID == 'NaN') {
      requestID = 0
    }

    if (offsetNo == 'NaN') {
      offsetNo = 0
    }

    if (showLimit == 'NaN') {
      showLimit = 100
    }
    console.log(typeof parseInt(requestID))
    var data
    try {
      await client.query('BEGIN')
      if (requestID == 0) {
        data = await client.query(queries.getRequestsAssignedToMe, [parseInt(managerID), parseInt(offsetNo), parseInt(showLimit)])
      } else {
        data = await client.query(queries.getRequestsAssignedToMeWithFilters, [parseInt(managerID), parseInt(requestID)])
      }
      console.log(data.rows)
      await client.query('COMMIT')
      res.json(
        {
          'Updated': true,
          'UpdatedData': data
        }
      )
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

exports.sendQueryData = function (req, res, next) {
  var query = req.body.Query
  pool.query(query, function (err, result) {
    if (err) {
      res.json({ 'Updated': false })
      next(err)
    }
    console.log(result)
    res.json(
      {
        'Updated': true,
        'UpdatedData': result
      }
    )
  })
}
exports.getManagerProfile = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var userID = req.user.user_id
    try {
      const requests = await client.query(queries.getUnresolvedRequestsAssignedToMe, [userID, 0, 5])
      const unassignedRequests = await client.query(queries.getUnassignedRequests)
      const graphDataRequest = await client.query(queries.perHourAverageByMonthQuery)
      const pastResolvedRequestHistory = await client.query(queries.getSolvedRequestsAssignedToMe, [userID, 0, 5])
      Promise.all([requests, unassignedRequests, graphDataRequest, pastResolvedRequestHistory]).then((data) => {
        var requestsData = data[0]
        var unassignedRequestsData = data[1]
        var graphData = data[2]
        var pastResolvedRequestHistoryData = data[3]
        console.log(requestsData.rows)
        console.log(unassignedRequestsData.rows)
        console.log(graphData.rows)
        console.log(pastResolvedRequestHistoryData.rows)
        res.render('managerprofile', {
          requests: requestsData.rows,
          unassignedRequests: unassignedRequestsData.rows,
          graphDataValues: graphData.rows,
          pastRequests: pastResolvedRequestHistoryData.rows
        })
      }).catch(err => {
        console.log(err)
        res.status(500)
      })
    } catch (e) {
      // @TODO
      // If got error , it means that user is not a manager, should be redirected to somwhere else
      res.redirect('./login')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}
