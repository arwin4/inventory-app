const mongoose = require('mongoose');

const dummySchema = mongoose.Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model('Dummy', dummySchema);
