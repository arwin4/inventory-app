const mongoose = require('mongoose');

const teaTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model('TeaType', teaTypeSchema);
