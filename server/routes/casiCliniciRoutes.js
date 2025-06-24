import express from 'express';
import { salvaCasoClinico } from '../controllers/casiCliniciController.js';

const router = express.Router();

router.post('/', salvaCasoClinico);

export default router;
