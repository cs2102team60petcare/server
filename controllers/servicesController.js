const pool = require('../database/connection')
const queries = require('../database/queries')

exports.getServicesPage = function (req, res, next) {
  pool.query(queries.getServicesQuery, (err, data) => {
    if (err) next(err)
    var servicesData = data.rows
    res.render('services', { service: servicesData })
  })
}
