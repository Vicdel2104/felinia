import mongoose from 'mongoose';

const gattoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  razza: { type: String, required: true },
  eta: { type: Number, required: true },
  sintomi: [String],
  note: String
}, {
  timestamps: true
});

const Gatto = mongoose.model('Gatto', gattoSchema);
export default Gatto;
