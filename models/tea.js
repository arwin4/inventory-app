const mongoose = require('mongoose');

const teaSchema = new mongoose.Schema({
  name: String,
  description: String,
  brewTemp: Number,
  price: Number,
  currentStock: Number,
  url: String,
  type: [{ type: mongoose.Schema.ObjectId, ref: 'TeaType' }],
});

module.exports = mongoose.model('Tea', teaSchema);
