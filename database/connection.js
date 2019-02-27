const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(client => {
    console.log('connected')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))

module.exports = pool;  