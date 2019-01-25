const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

let Account = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  }
})

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
