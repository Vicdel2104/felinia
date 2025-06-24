import express from 'express';
import Gatto from '../models/Gatto.js';

const router = express.Router();

// Crea un nuovo gatto
router.post('/', async (req, res) => {
  try {
    const gatto = new Gatto(req.body);
    await gatto.save();
    res.status(201).json(gatto);
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
});

// Prendi tutti i gatti
router.get('/', async (req, res) => {
  try {
    const gatti = await Gatto.find();
    res.json(gatti);
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// Aggiungi sintomo a un gatto (per diario)
router.post('/:id/sintomi', async (req, res) => {
  try {
    const gatto = await Gatto.findById(req.params.id);
    if (!gatto) return res.status(404).json({ errore: 'Gatto non trovato' });

    gatto.sintomiStorico.push({ descrizione: req.body.descrizione });
    await gatto.save();
    res.json(gatto);
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
});

export default router;
