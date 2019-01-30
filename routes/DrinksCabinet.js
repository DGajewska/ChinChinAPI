const Account = require('../models/account');
const Ingredient = require('../models/ingredient');
const SendResponse = require('./SendResponse');

class DrinksCabinet {
  static cabinetAdd(userId, ingredientsList, res) {
    Ingredient.aggregate([
      { $project: {
        name: true,
        _id: false }}]
    ).exec(
      (err, ingredients) => {
        if (err) { res.send(err) }
        let allowedIngredients = ingredients.map((item) => {
          return item.name;
        });

        let filteredList = ingredientsList.filter(function(element){
          return allowedIngredients.includes(element);
        })

        Account.updateOne(
          { _id: userId },
          { $addToSet:
            { cabinetIngredients:
              { $each: filteredList }
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
  
  static cabinetView(userId, res) {
    Account.findById(userId,
    { _id: false,
      cabinetIngredients: true})
      .exec(
        (err, account) => { SendResponse.standardResponse(res, err, account) }
      );
  }
}

module.exports = DrinksCabinet;
