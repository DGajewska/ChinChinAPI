const Cocktail = require('../models/cocktail');
const Ingredient = require('../models/ingredient');
const Account = require('../models/account');

class ReadFromDatabase {

  static allCocktails(res) {
    Cocktail.aggregate([
      { $project: {
        name: true,
        pictureUrl: true,
        _id: false }}]
    ).exec(
      (err, cocktails) => { standardResponse(res, err, cocktails) }
    );
  }

  static oneCocktail(cocktailName, res) {
    Cocktail.find(
      { name: cocktailName }
    ).populate(
      { path: 'ingredients.ingredient',
        select: 'name abv taste -_id' }
    ).exec(
      (err, cocktail) => { standardResponse(res, err, cocktail) }
    );
  }

  static findByCocktailId(cocktailId, res) {
    Cocktail.findById(
      cocktailId
    ).populate(
      { path: 'ingredients.ingredient',
        select: 'name -_id'}
    ).exec(
      (err, cocktail) => { standardResponse(res, err, cocktail) }
    );
  }

  static filterByCocktail(namesList, res) {
    Cocktail.aggregate([
      { $match: { name: { '$in': namesList }}}]
    ).exec(
      (err, cocktails) => { standardResponse(res, err, cocktails) }
    );
  }

  static filterByIngredient(ingredient, res) {
    Ingredient.find(
      { name: ingredient }, (err, ingredient) => {
    if (err) {
      res.send(err);
    }
    Cocktail.find(
      { ingredients: { $elemMatch: { ingredient: ingredient[0]._id }}}
    ).populate(
      { path: 'ingredients.ingredient', select: 'name -_id' }
    ).exec(
      (err, cocktails) => { standardResponse(res, err, cocktails) }
    )});
  }

  static allIngredients(res) {
    Ingredient.aggregate([
      { $project: {
        name: true,
        _id: false }}]
    ).exec(
      (err, ingredients) => { standardResponse(res, err, ingredients) }
    );
  }

  static ingredientByName(ingredientName, res) {
    Ingredient.findOne(
      { name: ingredientName }
    ).exec(
      (err, ingredient) => { standardResponse(res, err, ingredient) }
    );
  }

  static filterByIngredientSortByLeastMissing(ingredientsList, maxMissing, res) {
    Ingredient.find(
      { name: { $in: ingredientsList }},
      {_id: true }
    ).exec(
      (err, ingredients) => {
      if (err) {
        res.send(err);
      }
      let ingredientIds = ingredients.map((ingredient) => {
        return ingredient._id;
      })
      Cocktail.find(
        { ingredients: { $elemMatch: { ingredient: { $in: ingredientIds }}}},
        { name: true,
          pictureUrl: true,
          ingredients: true,
          _id: false }
      ).populate(
        { path: 'ingredients.ingredient',
          select: 'name -_id' }
      ).exec((err, cocktails) => {
        if (err){
          res.send(err);
        }
        let results = cocktails.map((cocktail) => {
          cocktail = cocktail.toObject();
          cocktail.missingCount = 0;

          cocktail.ingredients = cocktail.ingredients.map((item) => {
            if (!ingredientsList.includes(item.ingredient.name)) {
              cocktail.missingCount += 1;
            }
            return item.ingredient.name;
          });

          if (!maxMissing || cocktail.missingCount <= maxMissing) {
            return cocktail;
          }
        })

        let filteredResults = results.filter((element) => {
          return element != null;
        });

        filteredResults.sort((a, b) => { return a.missingCount - b.missingCount });

        res.json(filteredResults);
      })
    })
  }

  static cabinetView(userId, res) {
    Account.findById(userId,
    { _id: false,
      cabinetIngredients: true})
      .exec(
        (err, account) => { standardResponse(res, err, account) }
      );
  }

  static cabinetAdd(userId, ingredientsList, res) {
    Account.updateOne(
      { _id: userId },
      { $addToSet:
        { cabinetIngredients:
          { $each: ingredientsList }
        }
      }
    ).exec(
      (err) => {
        if (err) {
          res.send(err);
        }
        this.cabinetView(userId, res);
      }
    );
  }

  static cabinetDelete(userId, ingredientsList, res) {
    Account.updateOne(
      { _id: userId },
      { $pull:
        { cabinetIngredients:
          { $in: ingredientsList }
        }
      }
    ).exec(
      (err) => {
        if (err) {
          res.send(err);
        }
        this.cabinetView(userId, res);
      }
    );
  }

}

function standardResponse(response, error, result) {
  if (error) {
    response.send(error);
  }
  response.json(result);
}

module.exports = ReadFromDatabase;
