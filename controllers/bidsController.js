const pool = require('../database/connection')
const queries = require('../database/queries')

exports.getBidsPage = function (req, res, next) {
  pool.query(queries.getBidsQuery, (err, data) => {
    if (err) next(err)
    console.log(data)
    var databids = data.rows
    res.render('bids', { bids: databids })
  })
}
