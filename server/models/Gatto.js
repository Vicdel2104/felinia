import mongoose from 'mongoose';

const vaccinoSchema = new mongoose.Schema({
  nome: String,
  data: Date,
});

const gattoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  microchip: { type: String, default: '' },
  razza: String,
  sesso: String,
  eta: Number,
  colore: String,
  dataIngresso: { type: Date, default: Date.now },
  dataUscita: Date,
  provenienza: String,
  destinazione: String,
  adozioneNote: String,
  firmaAdottante: String,
  documentiAllegati: [String],
  dataRegistrazione: { type: Date, default: Date.now },
  interventi: [String],
  esamiClinici: [String],
  vaccini: [vaccinoSchema],
  sintomiStorico: [
    {
      descrizione: String,
      data: { type: Date, default: Date.now },
    }
  ]
});

const Gatto = mongoose.model('Gatto', gattoSchema);
export default Gatto;
