// Previously used API Routes
// RELOCATE THESE TO index.js IF REQUIRED

router.post('/ingredients/add', (req, res) =>{
  var newIngredient = new Ingredient();
  newIngredient._id = req.body._id;
  newIngredient.name = req.body.name;
  newIngredient.abv = req.body.abv;
  newIngredient.taste = req.body.taste;

  newIngredient.save((err) =>{
    if (err){
      res.send(err);
    }
    res.json({ message: 'Ingredient added successfully' });
  })
})

router.post('/cocktails/add', (req, res) =>{
  var newCocktail = new Cocktail();
  newCocktail.name = req.body.name;
  newCocktail.category = req.body.category;
  newCocktail.glass = req.body.glass;
  newCocktail.ingredients = req.body.ingredients;
  newCocktail.garnish = req.body.garnish;
  newCocktail.preparation = req.body.preparation;

  newCocktail.save((err) =>{
    if (err){
      res.send(err);
    }
    res.json({ message: 'Cocktail added successfully' });
  })
})

router.post('/ingredients/add-many', (req, res) => {
  Ingredient.insertMany(req.body.ingredientsList, (err) => {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Ingredients added successfully' });
  });
})

router.post('/cocktails/add-many', (req, res) => {
  Cocktail.insertMany(req.body.cocktailsList, (err) => {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Cocktails added successfully' });
  });
})

router.get('/cocktails/filter/by-cocktail/:namesList', (req, res) => {
  let namesList = req.params.namesList.split(',');
  ReadFromDatabase.filterByCocktail(namesList, res);
})

static filterByCocktail(namesList, res) {
  Cocktail.aggregate([
    { $match: { name: { '$in': namesList }}}]
  ).exec(
    (err, cocktails) => { standardResponse(res, err, cocktails) }
  );
}

router.get('/cocktails/id/:cocktailId', (req, res) => {
  ReadFromDatabase.findByCocktailId(req.params.cocktailId, res);
})

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

router.get('/cocktails/ingredient/:ingredientName', (req, res) => {
  ReadFromDatabase.filterByIngredient(req.params.ingredientName, res)
})

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

router.get('/ingredients/:ingredientName', (req, res) => {
  ReadFromDatabase.ingredientByName(req.params.ingredientName, res);
})

  static ingredientByName(ingredientName, res) {
    Ingredient.findOne(
      { name: ingredientName }
    ).exec(
      (err, ingredient) => { standardResponse(res, err, ingredient) }
    );
  }
