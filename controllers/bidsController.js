const pool = require('../database/connection')

exports.getBidsPage = function (req, res, next) {
  pool.query('SELECT * FROM bids', (err, data) => {
    if (err) next(err)
    var databids = data.rows
    res.render('bids', { bids: databids })
  })
}
