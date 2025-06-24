import mongoose from 'mongoose';

const vaccinoSchema = new mongoose.Schema({
  nome: String,
  data: Date,
});

const gattoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  microchip: { type: String, default: '' },
  dataRegistrazione: { type: Date, default: Date.now },
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
