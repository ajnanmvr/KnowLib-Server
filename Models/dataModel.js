const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  url: { type: String, required: true, unique: true }
});

const DataModel = mongoose.model('WebSites', dataSchema);

module.exports = DataModel;
