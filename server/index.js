const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "*",
  credentials: true
}));
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

// Test du port
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});

// Test de connexion
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connexion à la base PostgreSQL réussie.");
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base :", err);
  });

// Route pour obtenir les sommets
app.get("/getStops", async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query("SELECT stop_id, stop_name FROM stops");
    const stops = results.map(stop => ({
      stop_id: stop.stop_id,
      stop_name: stop.stop_name
    }));
    res.send({ success: true, stops });
  } catch (err) {
    console.error("Erreur lors de la récupération des arrêts :", err);
    res.status(500).send({ success: false, message: "Erreur serveur." });
  }
});

// Route pour obtenir la premières partie des aretes
app.get("/getTransfers", async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query("SELECT from_stop_id, to_stop_id, min_transfer_time FROM transfers");
    const transfers = results.map(t => ({
      from_stop_id: t.from_stop_id,
      to_stop_id: t.to_stop_id,
      min_transfer_time: t.min_transfer_time
    }));
    res.send({ success: true, transfers });
  } catch (err) {
    console.error("Erreur lors de la récupération des transfert :", err);
    res.status(500).send({ success: false, message: "Erreur serveur." });
  }
});

// Route pour obtenir la deuxième partie des aretes
app.get("/getLines", async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query("SELECT trip_id, stop_id, arrival_time, departure_time, stop_sequence from selected_stop_times");
    const trips = results.map(t => ({
      trip_id: t.trip_id,
      stop_id: t.stop_id,
      arrival_time: t.arrival_time,
      departure_time: t.departure_time,
      stop_sequence: t.stop_sequence
    }));
    res.send({ success: true, trips });
  } catch (err) {
    console.error("Erreur lors de la récupération des transfert :", err);
    res.status(500).send({ success: false, message: "Erreur serveur." });
  }
});