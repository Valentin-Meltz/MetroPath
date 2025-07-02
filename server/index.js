/**
 * 📦 Commandes à exécuter avant de lancer le serveur :
 * npm init -y
 * npm install express sequelize pg cors
 *
 * ▶️ Pour lancer le serveur :
 * node server/index.js
 */

const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuration de la base PostgreSQL (Render) sans .env
const sequelize = new Sequelize(
  "metropath_database", // Nom de la base
  "metropath_database_user", // Nom d'utilisateur
  "2h1mvSwUJ8dm8lcy6q3sPStZUxY6GugT", // Mot de passe
  {
    host: "dpg-d1hqds3uibrs73fo2vkg-a.oregon-postgres.render.com", // Host Render complet
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

// Test de connexion
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connexion à la base PostgreSQL réussie.");
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base :", err);
  });

// Route de test
app.get("/api/test-db", async (req, res) => {
  try {
    const [result] = await sequelize.query("SELECT NOW()");
    res.json({ time: result[0].now });
  } catch (err) {
    res.status(500).send("Erreur requête BDD");
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});