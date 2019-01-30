const Cocktail = require('../models/cocktail');
const Ingredient = require('../models/ingredient');
const SendResponse = require('./SendResponse');

class ReadFromDatabase {
  static allCocktails(res) {
    Cocktail.aggregate([
      { $project: {
        name: true,
        pictureUrl: true,
        _id: false }}]
    ).exec(
      (err, cocktails) => { SendResponse.standardResponse(res, err, cocktails) }
    );
  }

  static filterByIngredientSortByLeastMissing(ingredientsList, maxMissing, res) {
    Ingredient.find(
      { name: { $in: ingredientsList }},
      {_id: true }
    ).exec(
      (err, ingredients) => { findCocktails(err, ingredients, ingredientsList, maxMissing, res) }
    )
  }

  static oneCocktail(cocktailName, res) {
    // find() is used rather than findOne() as the ChinChin React app expects an array
    // attempts were made to have the app act on an object, but without success
    Cocktail.find(
      { name: cocktailName }
    ).populate(
      { path: 'ingredients.ingredient',
        select: 'name abv taste -_id' }
    ).exec(
      (err, cocktail) => { SendResponse.standardResponse(res, err, cocktail) }
    );
  }
}

module.exports = ReadFromDatabase;

// functions below are only used by methods in this class - they are not exposed

function findCocktails(err, ingredients, ingredientsList, maxMissing, res) {
  if (err) { res.send(err) }

  let ingredientIds = ingredients.map((ingredient) => { return ingredient._id; });

  Cocktail.find(
    { ingredients: { $elemMatch: { ingredient: { $in: ingredientIds }}}},
    { name: true,
      pictureUrl: true,
      ingredients: true,
      _id: false }
  ).populate(
    { path: 'ingredients.ingredient',
      select: 'name -_id' }
  ).exec(
    (err, cocktails) => { prepareResponse(err, cocktails, ingredientsList, maxMissing, res) }
  )
}

function calculateAllMissingCounts(cocktails, ingredientsList, maxMissing) {
  let results = cocktails.map((cocktail) => {
    cocktail = cocktail.toObject();
    cocktail.missingCount = 0;
    cocktail = calculateMissingIngredientCountForCocktail(cocktail, ingredientsList)

    if (!maxMissing || cocktail.missingCount <= maxMissing) { return cocktail }
  });

  return results
}

function calculateMissingIngredientCountForCocktail(cocktail, ingredientsList) {
  cocktail.ingredients = cocktail.ingredients.map((item) => {
    if (!ingredientsList.includes(item.ingredient.name)) {
      cocktail.missingCount += 1;
    }
    return item.ingredient.name;
  });
  return cocktail;
}

function prepareResponse(err, cocktails, ingredientsList, maxMissing, res) {
  if (err) { res.send(err) }

  let results = calculateAllMissingCounts(cocktails, ingredientsList, maxMissing);
  let filteredResults = removeNullElements(results);
  res.json(filteredResults);
}

function removeNullElements(results) {
  let filteredResults = results.filter((element) => {
    return element != null;
  });
  filteredResults.sort((a, b) => { return a.missingCount - b.missingCount });
  return filteredResults;
}

module.exports = ReadFromDatabase;
