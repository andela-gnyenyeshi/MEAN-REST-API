//Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema
var bookSchema = new Schema({
  name: String,
  rating: Number
});

//Model
var Book = mongoose.model('Book', bookSchema);

//export
module.exports = Book;