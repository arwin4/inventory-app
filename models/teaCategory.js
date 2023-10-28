const mongoose = require('mongoose');

const teaCategorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

teaCategorySchema.virtual('url').get(function () {
  return `/catalog/category/${this._id}`;
});

module.exports = mongoose.model('TeaCategory', teaCategorySchema);
