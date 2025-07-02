const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const routes = require("./routes");
app.use("/", routes);

// Configuration de la base PostgreSQL (Render) avec .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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