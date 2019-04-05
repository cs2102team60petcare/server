const pool = require('../database/connection')

exports.getServicesPage = function (req, res, next) {
  pool.query('SELECT * FROM services', (err, data) => {
    if (err) next(err)
    var servicesData = data.rows
    console.log(servicesData)
    res.render('services', { service: servicesData })
  })
}
