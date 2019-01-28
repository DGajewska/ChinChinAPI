const mongoose = require("mongoose");
const ReadFromDatabase = require ('../routes/ReadFromDatabase')

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const expect = chai.expect

chai.use(chaiHttp);

describe('API Routes', () => {

  describe('/GET cocktails containing single ingredient', () => {
    it('it should GET cocktails containing single ingredient', (done) => {
      chai.request(server)
        .get("/cocktails/ingredient/Cranberry juice")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            var result = res.body

            result.forEach(cocktail => {
              var ingredients = []
              cocktail.ingredients.forEach(ingredient => {
                ingredients.push(ingredient.ingredient.name)
              })
                expect(ingredients).to.include('Cranberry juice')
              })
          done();
        })
    })
  })

  describe('/GET cocktails containing ingredients, sort by least missing', () => {
    it('it should GET cocktails containing ingredients, sorted by least amount of ingredients missing', (done) => {
      chai.request(server)
        .get("/cocktails/filter/by-ingredient/:ingredients/:maxMissing?")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            console.log(res.body)
            // var result = res.body
            //
            // result.forEach(cocktail => {
            //   var ingredients = []
            //   cocktail.ingredients.forEach(ingredient => {
            //     ingredients.push(ingredient.ingredient.name)
            //   })
            //     expect(ingredients).to.include('Cranberry juice')
            //   })
          done();
        })
    })
  })

  describe('/GET ingredient by name', () => {
      it('it should GET one ingredient by name', (done) => {
        chai.request(server)
            .get('/ingredients/Gin')
            .end((err, res) => {
                  res.should.have.status(200)
                  res.body.should.be.a('object')
                  expect(res.body.name).equal('Gin')
              done()
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

})
