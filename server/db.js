import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'dpg-d1if77er433s73ah1ak0-a.oregon-postgres.render.com',
  port: 5432,
  user: 'metropath_database_km6r_user',
  password: '0kG67YA5ztUTa5at7O1gt4Vnl9bImJRZ',
  database: 'metropath_database_km6r',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de connexion (affiche l'heure du serveur si OK)
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Connexion réussie à PostgreSQL !');
    console.log('🕒 Heure du serveur :', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à PostgreSQL :', err.stack);
  });

export default pool;
