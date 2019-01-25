const Ingredient = require('../models/ingredient');
const Cocktail = require('../models/cocktail');

class ReadFromDatabase {
  static filterByCocktail(namesList, res) {
    Cocktail.aggregate([
        { $match: { name: { '$in': namesList } } }
      ]).exec(
        (err, cocktails) => { standardResponse(res, err, cocktails) }
      );
  }

  static ingredientByName(ingredientName, res) {
    Ingredient.findOne(
        {name: ingredientName}
      ).exec(
        (err, ingredient) => { standardResponse(res, err, ingredient) }
      );
  }
}

function standardResponse(response, error, result) {
  if (error){
    response.send(error);
  }
  response.json(result);
}

module.exports = ReadFromDatabase;
