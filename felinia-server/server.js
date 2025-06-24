import dotenv from 'dotenv';
dotenv.config(); // Deve essere prima di tutto

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import gattiRouter from './routes/gattiRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Verifica API key OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY non trovata nel file .env');
  process.exit(1);
}

// Configura OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/felinia';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connesso a MongoDB');
}).catch(err => {
  console.error('❌ Errore di connessione a MongoDB:', err.message);
});

// Rotte API
app.use('/api/gatti', gattiRouter);
app.use('/api/user', userRoutes);

// 🔥 Rotta AI diagnosi e consigli
app.post('/api/ai/analizza', async (req, res) => {
  const { nome, descrizione, tipo = 'diagnosi' } = req.body;

  if (!descrizione) {
    return res.status(400).json({ errore: 'Descrizione mancante.' });
  }

  const promptSystem = tipo === 'consiglio'
    ? 'Sei un nutrizionista felino. Dai solo consigli alimentari utili per gatti, in base al caso descritto. Evita diagnosi mediche.'
    : 'Sei un assistente veterinario specializzato in medicina felina. Analizza i sintomi descritti e segnala possibili problemi con prudenza.';

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: promptSystem },
        { role: 'user', content: `Gatto: ${nome || 'N/A'}\n${descrizione}` }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const risultato = completion.choices[0]?.message?.content?.trim();
    res.json({ risultato });
  } catch (err) {
    console.error('❌ Errore durante la chiamata a OpenAI:', err.message);
    res.status(500).json({ errore: 'Errore AI', dettaglio: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ errore: 'Risorsa non trovata' });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});

// Eventi MongoDB
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB error:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnesso');
});
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('🔌 Connessione MongoDB chiusa');
    process.exit(0);
  });
});
