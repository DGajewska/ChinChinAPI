const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let garnishSchema = new Schema({
  name: { type: String, required: true }
})

module.exports = mongoose.model('Garnish', garnishSchema);
