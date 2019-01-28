// RELOCATE THESE TO index.js IF DB NEEDS TO BE REPOPULATE

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
