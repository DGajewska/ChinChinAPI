const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cocktailSchema = new Schema({
  name: { type: String, required: true },
  glass: { type: String },
  category: { type: String, required: true },
  ingredients: [{ ingredient: { type: Schema.Types.ObjectId, ref:'Ingredient', required: true }, unit: { type: String }, amount: { type: Number }}],
  garnish: [{ type: Schema.Types.ObjectId, ref: 'Garnish' }],
  preparation: { type: String, required: true },
  pictureUrl: { type: String }
})

module.exports = mongoose.model('Cocktail', cocktailSchema);
