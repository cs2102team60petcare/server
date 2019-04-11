const pool = require('../database/connection')
const queries = require('../database/queries')

exports.getUserProfilePage = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var userID = req.user.user_id
    var userRole = req.user.role
    try {
      await client.query('BEGIN')
      const { rows } = await client.query(queries.fullUserProfileQuery, [userID])
      var userData = rows[0]
      userData['role'] = userRole
      await client.query('COMMIT')
      res.render('profile', userData)
    } catch (e) {
      await client.query('ROLLBACK')
      res.redirect('./login')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.log(e.stack))
}

exports.updateProfile = function (req, res, next) {
  (async () => {
    const client = await pool.connect()
    var userID = req.user.user_id
    var name = req.body.name
    var email = req.body.email
    var phone = req.body.phone
    var address = req.body.address

    try {
      await client.query('BEGIN')
      const { rows } = await client.query(queries.userProfileUpdate, [name, email, phone, { address }, userID])
      await client.query('COMMIT')
      res.json({ 'Updated': true,
        'Data': rows[0]
      })
    } catch (e) {
      await client.query('ROLLBACK')
      res.json({ 'Updated': false })
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.log(e.stack))
}
