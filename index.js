const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Ingredient = require('./models/ingredient');
const Cocktail = require('./models/cocktail');

require('dotenv').config();

const app = express();

// Configure app for bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up port for server to listen on
const port = process.env.PORT || 3000;

// Connect to DB
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useCreateIndex: true })

// API Routes
const router = express.Router();

// Prefix routes with /api/chinchin
app.use('/api/chinchin', router);


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

router.get('/cocktails/ingredient/:ingredientName', (req, res) => {
  Ingredient.find({name: req.params.ingredientName}, (err, ingredient) => {
    if (err){
      res.send(err);
    }
  Cocktail.
    find({ ingredients: { $elemMatch: { ingredient: ingredient[0]._id }}}).
    populate({ path: 'ingredients.ingredient', select: 'name -_id' }).
    exec((err, cocktails) => {
      if (err){
        res.send(err);
      }
      res.json(cocktails);
    })
  })
})

router.get('/cocktails/id/:cocktailId', (req, res) => {
  Cocktail.
    findById(req.params.cocktailId).
      populate({ path: 'ingredients.ingredient', select: 'name -_id'}).
      exec((err, cocktail) => {
        if (err) {
          res.send(err);
        }
        res.json(cocktail);
  })
})

router.get('/cocktails/all', (req, res) => {
  Cocktail.
    aggregate([
      {
        $project: {
          name: true,
          pictureUrl: true,
          _id: false
        }
      }
    ])
    .exec((err, cocktail) => {
    if (err) {
      res.send(err);
    }
    res.json(cocktail);
  })
})

router.get('/cocktails/name/:cocktailName', (req, res) => {
  Cocktail.find({ name: req.params.cocktailName }).
    populate({ path: 'ingredients.ingredient', select: 'name abv taste -_id' }).
    exec((err, cocktail) => {
      if (err) {
      res.send(err);
      }
      res.json(cocktail);
    })
})

router.get('/cocktails/filter/:namesList', (req, res) => {
  console.log(req.params);
  let namesList = req.params.namesList.split(',');
  console.log(namesList);
  Cocktail.aggregate([
      {
        $match: { name: { '$in': namesList } }
      }
    ]).
    exec((err, cocktails) => {
      if(err) {
        res.send(err);
      }
      console.log(cocktails);
      res.json(cocktails);
    })
})

router.get('/ingredients/:ingredientName', (req, res) => {
  Ingredient.find({name: req.params.ingredientName}, (err, ingredient) => {
    if (err){
      res.send(err);
    }
    res.json(ingredient);
  })
})

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(port);
console.log(`Server is listening on port ${port}`);
