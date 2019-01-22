const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ingredientSchema = new Schema({
  name: { type: String, required: true },
  abv: { type: Number, required: true, default: 0 },
  taste: { type: String, default: null }
})

module.exports = mongoose.model('Ingredient', ingredientSchema);
