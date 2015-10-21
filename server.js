//Dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var parser = require('body-parser');
var morgan = require('morgan');
var Book = require('./models/books');
var path = require('path');
var passport = require('passport');
var passportLocal = require('passport-local');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


var port = process.env.PORT || 2020
var db = 'mongodb://sheshe:sheshe@ds051873.mongolab.com:51873/books';

//Database connect
mongoose.connect(db);

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/views'));

//Environment. Parser Middleware configuration
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());
app.use(cookieParser());
app.use(expressSession({secret : process.env.SESSION_SECRET || 'secret',
  resave : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done) {
  if (username === password) {
    done (null, {id : username, name : username});
  } else {
    done (null, null);
  }
}));

//Serialize
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, {id : id, name : id});
})


//Routes
var route1 = express.Router();

route1.route('/books').post(function (req, res) {
  if ({isAuthenticated : false}) {
    res.redirect('/');
  } else
  var book = new Book();
  book.name = req.body.name;
  book.rating = req.body.rating;

  //Save the new data
  book.save(function (err) {
    if (err) throw err;
      // res.json({message: "Recorded!"});
      res.send("Saved!")
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
  // res.render('login', {
  //   isAuthenticated: req.isAuthenticated(),
  //   user: req.user
  res.render('login');
  });

route1.post('/', passport.authenticate('local'), function (req, res) {
  res.redirect('api/books');
})


app.use('/api', route1);

app.listen(port);
console.log("Server up at port " + port);
