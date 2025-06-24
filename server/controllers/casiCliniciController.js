export function salvaCasoClinico(req, res) {
  try {
    const { nomeGatto, razza, eta, sintomi, anamnesi, esamiEffettuati, noteVeterinario } = req.body;

    if (!nomeGatto || !razza || !eta) {
      return res.status(400).json({ errore: 'Dati obbligatori mancanti.' });
    }

    console.log('✅ Caso clinico ricevuto:', {
      nomeGatto, razza, eta, sintomi, anamnesi, esamiEffettuati, noteVeterinario
    });

    if (req.files) {
      console.log('📎 File ricevuti:', Object.keys(req.files));
    }

    return res.json({ messaggio: 'Caso clinico ricevuto con successo' });

  } catch (err) {
    console.error('❌ Errore nel controller:', err);
    res.status(500).json({ errore: 'Errore interno server' });
  }
}
