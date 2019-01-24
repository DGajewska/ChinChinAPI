const Ingredient = require('../models/ingredient');
const Cocktail = require('../models/cocktail');

class ReadFromDatabase {
  static ingredientByName(req, res) {
    Ingredient.findOne({name: req.params.ingredientName}).exec((err, ingredient) => {
      if (err){
        res.send(err);
      }
      res.json(ingredient);
    })
  }
}

module.exports = ReadFromDatabase;
