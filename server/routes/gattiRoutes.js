import express from 'express';
import Gatto from '../models/Gatto.js';
import PDFDocument from 'pdfkit';

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

// Esporta PDF completo gatto
router.get('/:id/pdf', async (req, res) => {
  try {
    const gatto = await Gatto.findById(req.params.id);
    if (!gatto) return res.status(404).json({ errore: 'Gatto non trovato' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="felinia_${gatto.nome}_completo.pdf"`);
    doc.pipe(res);

    doc.fontSize(18).text(`FelinIA - Profilo ${gatto.nome}`, { underline: true });
    doc.moveDown();
    const info = [
      `Microchip: ${gatto.microchip || '-'}`,
      `Razza: ${gatto.razza || '-'}`,
      `Sesso: ${gatto.sesso || '-'}`,
      `Età: ${gatto.eta || '-'}`,
      `Colore: ${gatto.colore || '-'}`,
      `Ingresso: ${gatto.dataIngresso ? gatto.dataIngresso.toISOString().split('T')[0] : '-'}`,
      `Uscita: ${gatto.dataUscita ? gatto.dataUscita.toISOString().split('T')[0] : '-'}`,
      `Provenienza: ${gatto.provenienza || '-'}`,
      `Destinazione: ${gatto.destinazione || '-'}`
    ];
    info.forEach(i => doc.text(i));

    doc.moveDown();
    doc.text('Vaccinazioni:', { underline: true });
    gatto.vaccini.forEach(v => {
      doc.text(`- ${v.nome} (${v.data ? v.data.toISOString().split('T')[0] : '-'})`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

export default router;
