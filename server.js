//Dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var parser = require('body-parser');
var morgan = require('morgan');
var Book = require('./models/books')

var port = process.env.PORT || 2020
var db = 'mongodb://sheshe:sheshe@ds051873.mongolab.com:51873/books';

//Database connect
mongoose.connect(db);
//Environment. Parser
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

app.use(morgan('dev'));

//Routes
var route1 = express.Router();

route1.route('/books').post(function (req, res) {
  var book = new Book();
  book.name = req.body.name;
  book.rating = req.body.rating;

  //Save the new data
  book.save(function (err) {
    if (err) throw err;
      res.json({message: "Recorded!"});
  });
});

//Shpw all the books in db
route1.route('/books').get(function (req, res) {
  Book.find(function (err, book) {
    if (err) throw err;
      res.json(book);
  });
});

//Get a book by id
route1.route('/books/:book_id').get(function (req, res) {
  Book.findById(req.params.book_id, function (err, book) {
    if (err) throw err;
      res.json(book);
  });
});

//Update a book by id
route1.route('/books/:book_id').put(function (req, res) {
  Book.findById(req.params.book_id, function (err, book) {
    if (err) throw err;

    //Update the book info
      book.name = req.body.name;
      book.rating = req.body.rating;

      //Save book
      book.save(function (book, err) {
        if (err) throw err
          res.json({message: "Book Updated!"});
      });
  });
});


route1.get('/', function (req, res) {
  res.json({message: "wELCOME TO THE API"});
});

app.use('/api', route1);

app.listen(port);
console.log("Server up at port " + port);