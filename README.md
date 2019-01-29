# Chin Chin API
This is an API which forms part of the backend for [Chin Chin cocktails app](https://github.com/joecoker/ChinChinReactApplication) for the final engineering project at Makers.

The API is a Node.js and Express app. Tested using Mocha testing environment and Chai assertion library, including the Chai-http and Chai-arrays extensions


## Heroku URL
Our API is hosted on AWS and Heroku through the following url:
https://chinchinapi.herokuapp.com

## Routes
For all cocktails which contain an ingredient use:
[https://chinchinapi.herokuapp.com/cocktails/ingredient/:ingredientName]
The ingredient name must be capitalised ie. Gin
Two word ingredient names will have a space between then with only the first letter of the first word capitalised ie. Orange juice
