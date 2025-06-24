import mongoose from 'mongoose';

const sintomoEntrySchema = new mongoose.Schema({
  nomeGatto: { type: String, required: true },
  descrizione: { type: String, required: true },
  data: { type: Date, default: Date.now },
  fileUrls: [String],  // lista URL o nomi file caricati (gestione file da implementare)
  rispostaAI: { type: String },  // testo analisi AI (flag, diagnosi, consigli)
}, { timestamps: true });

const SintomoEntry = mongoose.model('SintomoEntry', sintomoEntrySchema);

export default SintomoEntry;
