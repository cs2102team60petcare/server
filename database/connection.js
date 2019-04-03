const { Pool } = require('pg')

// Load environment variables
require('dotenv').load()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl : true
})

pool.connect()
  .then(client => {
    console.log('connected')
    client.release()
  })
  .catch(err => console.error('error connecting ' + process.env.DATABASE_URL, err.stack))

module.exports = pool
