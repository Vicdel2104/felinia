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
    res.json({ risultato: risposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore durante analisi AI' });
  }
}

