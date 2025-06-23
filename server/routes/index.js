import express from 'express';
const router = express.Router();
import V1 from '../controllers/version1.js';

router.get('/shorterPath/:depart/:arrivee', V1.getShorterPath);
router.get('/getAllStations', V1.getAllStations);