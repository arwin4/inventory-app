const mongoose = require('mongoose');

const teaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brewTemp: { type: Number, required: true },
  price: { type: Number, min: [0, 'Price cannot be negative'], required: true },
  currentStock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    required: true,
  },
  url: String,
  type: [{ type: mongoose.Schema.ObjectId, ref: 'TeaType' }],
});

module.exports = mongoose.model('Tea', teaSchema);
