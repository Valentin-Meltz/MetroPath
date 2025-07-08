import express from 'express';
import * as controller from '../controllers/Version2.js';

const router = express.Router();

router.get('/stops', controller.getStops);
router.get('/transfers', controller.getTransfers);
router.get('/lines', controller.getLines);
router.get('/shorter-path', controller.shorterPath);

export default router;