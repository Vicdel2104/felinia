import SintomoEntry from '../models/SintomoEntry.js';

function determinaFlag(testo) {
  const lower = testo.toLowerCase();
  const gravi = ['sangue', 'non respira', 'convuls', 'grave', 'vomito persistente'];
  const moderati = ['febbre', 'letarg', 'inappetenza', 'tosse'];
  if (gravi.some(k => lower.includes(k))) return 'Grave';
  if (moderati.some(k => lower.includes(k))) return 'Moderato';
  return 'Lieve';
}

export async function analizzaSintomi(req, res) {
  const { nome, descrizione } = req.body;
  const files = req.files; // array file caricati

  if (!nome || !descrizione) {
    return res.status(400).json({ errore: 'Nome gatto o descrizione mancante' });
  }

  // Qui puoi loggare o processare i file se vuoi
  console.log('File ricevuti:', files);

  // La logica AI come prima
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completamento = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Sei un assistente veterinario esperto in medicina felina. Analizza il caso clinico descritto in linguaggio naturale, individua segnali di rischio, urgenza, ipotesi diagnostiche compatibili e raccomandazioni per il pet owner. Mostra la risposta in modo ordinato con sezioni: Rischio, Urgenza, Diagnosi possibili, Raccomandazioni. Rispondi sempre in italiano.'
        },
        {
          role: 'user',
          content: descrizione
        }
      ]
    });

    const risposta = completamento.choices[0].message.content;
    const flag = determinaFlag(descrizione);

    // Salva storico AI
    const entry = new SintomoEntry({
      nomeGatto: nome,
      descrizione,
      rispostaAI: risposta,
      flag
    });

    await entry.save();

    res.json({ risultato: risposta, flag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore durante analisi AI' });
  }
}

