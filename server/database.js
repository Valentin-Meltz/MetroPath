const { Pool } = require('pg');

const pool = new Pool({
  user: 'metropath_database_km6r_user',
  host: 'dpg-d1if77er433s73ah1ak0-a',
  database: 'metropath_database_km6r',
  password: 'metropath_database_km6r_user',
  port: 5432,
});

module.exports = pool;