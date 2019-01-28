const mongoose = require("mongoose");
const ReadFromDatabase = require ('../routes/ReadFromDatabase')

//Require the dev-dependencies
const chai = require('chai');
const assertArrays = require('chai-arrays');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const expect = chai.expect

chai.use(assertArrays);
chai.use(chaiHttp);

describe('API Routes', () => {

  describe('/GET a list of all cocktails in the database', () => {
    it('each cocktail in the list should have a name and pictureUrl', (done) => {
      chai.request(server)
        .get("/cocktails/all")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          var result = res.body;

          result.forEach(cocktail => {
            expect(cocktail).to.have.property('name');
            expect(cocktail).to.have.property('pictureUrl');
          })
          done();
        })
    })
  })

  describe('/GET details for each cocktail in a list of names', () => {
    it('each cocktail returned matches a name in the list provided', (done) => {
      chai.request(server)
        .get("/cocktails/filter/by-cocktail/Screwdriver,Mojito,Horse's Neck")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          var result = res.body;

          result.forEach(cocktail => {
            expect(cocktail.name).to.be.oneOf(["Screwdriver", "Mojito", "Horse's Neck"]);
          })
          done();
        })
    })
  })

  describe('/GET cocktails containing ingredients, sort by least missing', () => {
    it('it should GET cocktails containing ingredients, sorted by least amount of ingredients missing', (done) => {
      chai.request(server)
        .get("/cocktails/filter/by-ingredient/Gin,Vodka,Orange juice")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          var result = res.body;

          result.forEach((cocktail, index, result) => {
            expect(cocktail.ingredients).to.be.containingAnyOf(['Vodka', 'Gin', 'Orange juice']);
            if (index > 0) {
              expect(cocktail.missingCount).to.be.at.least(result[index - 1].missingCount);
            }
          })
          done();
        })
    })

    it('has an option to limit the number of missing ingredients', (done) => {
      chai.request(server)
        .get("/cocktails/filter/by-ingredient/Gin,Vodka,Orange juice/1")
        .end((err, res) => {
          var result = res.body;

          result.forEach((cocktail, index, result) => {
            expect(cocktail).to.have.property('missingCount').below(2);
          })
          done();
        })
    })
  })

  describe('/GET cocktails containing single ingredient', () => {
    it('it should GET cocktails containing single ingredient', (done) => {
      chai.request(server)
        .get("/cocktails/ingredient/Cranberry juice")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          var result = res.body;

          result.forEach(cocktail => {
            var ingredients = []
            cocktail.ingredients.forEach(ingredient => {
              ingredients.push(ingredient.ingredient.name);
            })
            expect(ingredients).to.include('Cranberry juice');
          })
          done();
        })
    })
  })

  describe('/GET cocktail by name', () => {
    it('it should GET one cocktail by name', (done) => {
      chai.request(server)
        .get("/cocktails/name/Horse's Neck")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.name).equal("Horse's Neck");
          done();
        })
    })
  })

  describe('/GET ingredient by name', () => {
    it('it should GET one ingredient by name', (done) => {
      chai.request(server)
        .get('/ingredients/Gin')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.name).equal('Gin');
          done();
        })
    })
  })

})
