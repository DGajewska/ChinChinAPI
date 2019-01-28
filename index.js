require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const authMiddleware = require('./middleware/authmiddleware');
const ReadFromDatabase = require('./routes/ReadFromDatabase');

const authenticate = authMiddleware.authenticate;
const generateAccessToken = authMiddleware.generateAccessToken;
const respond = authMiddleware.respond;

// API Routes
const router = express.Router();

const app = express();

// Set up port for server to listen on
const port = process.env.PORT || 3005;

// Configure app for bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allows connections from external sources
app.use(cors());

// Connect to DB
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useCreateIndex: true })

//passport config
app.use(passport.initialize());

let Account = require('./models/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', router);

app.get('/', (_, res) => {
  res.json({message: 'Welcome to Chin Chin API'})
})

router.get('/cocktails/ingredient/:ingredientName', (req, res) => {
  ReadFromDatabase.filterByIngredient(req.params.ingredientName, res)
})

router.get('/cocktails/filter/by-ingredient/:ingredients/:maxMissing?', (req, res) => {
  let ingredientsList = req.params.ingredients.split(',');
  let maxMissing = req.params.maxMissing;
  ReadFromDatabase.filterByIngredientSortByLeastMissing(ingredientsList, maxMissing, res)
})

router.get('/cocktails/id/:cocktailId', (req, res) => {
  ReadFromDatabase.findByCocktailId(req.params.cocktailId, res);
})

router.get('/cocktails/all', (_, res) => {
  ReadFromDatabase.allCocktails(res);
})

router.get('/cocktails/name/:cocktailName', (req, res) => {
  ReadFromDatabase.oneCocktail(req.params.cocktailName, res)
})

router.get('/cocktails/filter/by-cocktail/:namesList', (req, res) => {
  let namesList = req.params.namesList.split(',');
  ReadFromDatabase.filterByCocktail(namesList, res);
})

router.get('/ingredients/all', (_, res) => {
  ReadFromDatabase.allIngredients(res);
})

router.get('/ingredients/:ingredientName', (req, res) => {
  ReadFromDatabase.ingredientByName(req.params.ingredientName, res);
})

router.post('/register', (req,res) => {
  Account.register(new Account({
    username: req.body.email
  }), req.body.password, (err,account) =>{
    if (err){
      res.send(err);
      return;
    }
    passport.authenticate(
      'local', {
        session: false
      })(req, res, () => {
        res.status(200).json({message: 'Successfully created new account'});
      });
  });
});

router.post('/login', passport.authenticate('local', {
  session: false,
  scope: []
}), generateAccessToken, respond);

router.get('/logout', authenticate, (req, res) => {
    req.logout();
    res.status(200).send('Successfully logged out');
});

router.get('/me', authenticate, (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
});

app.listen(port);
console.log(`Server is listening on port ${port}`);
