const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true

  idade: {
    type: Number,
    required: [true, 'Idade é obrigatória'],
    min: [0, 'Idade deve ser maior que 0'],
    max: [150, 'Idade deve ser menor que 150']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
