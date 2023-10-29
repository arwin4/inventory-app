const mongoose = require('mongoose');

const teaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brewTemp: { type: Number, required: true },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    required: true,
  },
  currentStock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    required: true,
  },
  category: [{ type: mongoose.Schema.ObjectId, ref: 'TeaCategory' }],
});

teaSchema.virtual('url').get(function () {
  return `/catalog/tea/${this._id}`;
});

module.exports = mongoose.model('Tea', teaSchema);
