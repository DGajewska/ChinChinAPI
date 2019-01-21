const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// Configure app for bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up port for server to listen on
const port = 3000;

// Connect to DB
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useCreateIndex: true })

// API Routes
const router = express.Router();

// Prefix routes with /api/chinchin
app.use('/api/chinchin', router);

// Test route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Chin Chin API' });
});


app.listen(port);
console.log(`Server is listening on port ${port}`);
