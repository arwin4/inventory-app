const mongoose = require('mongoose');

const teaTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
});

teaTypeSchema.virtual('url').get(function () {
  return `/catalog/type/${this._id}`;
});

module.exports = mongoose.model('TeaType', teaTypeSchema);
