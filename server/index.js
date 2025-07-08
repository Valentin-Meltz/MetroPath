import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js'; // ton routeur principal

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
