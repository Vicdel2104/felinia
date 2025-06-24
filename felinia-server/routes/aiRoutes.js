import express from 'express';
import multer from 'multer';
import { analizzaSintomi } from '../controllers/aiController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // cartella upload

router.post('/analizza', upload.array('file'), analizzaSintomi);

export default router;
