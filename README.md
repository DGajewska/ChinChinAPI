# Chin Chin API
Mongodb API for Chin Chin cocktails app for final engineering project at Makers


## Heroku URL
https://chinchinapi.herokuapp.com

## Routes Available for use
To retrieve a list of all the cocktails with names and images
https://chinchinapi.herokuapp.com/cocktails/all

To retrieve a list of all cocktails, ordered by the least number of missing ingredients
https://chinchinapi.herokuapp.com/cocktails/filter/by-ingredient/:ingredients/:maxMissing?
where :ingredients is a comma separated list of the ingredients i.e.Gin,Vodka,Orange Juice
where :maxMissing is an optional parameter, and is an integer

To retrieve a cocktail by it's name
https://chinchinapi.herokuapp.com/cocktails/name/:cocktailName
where :cocktailName is the name of the cocktail, including any spaces and punctuation
