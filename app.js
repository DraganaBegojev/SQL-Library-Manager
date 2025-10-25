var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

const { sequelize } = require('./models');

var app = express();

// set up middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// Handle 404 - Page Not Found
app.use(function(req, res, next) {
  const error = new Error('Sorry, the page you are looking for does not exist.');
  error.status = 404;
  console.log(`${error.status} - ${error.message}`);
  res.status(404).render('page-not-found', { error });
});

// Global Error Handler
app.use(function(error, req, res, next) {
  error.status = error.status || 500;
  error.message = error.message || 'Sorry! There was an unexpected error on the server.';

  console.log(`${error.status} - ${error.message}`);

  if (error.status === 404) {
    res.status(404).render('page-not-found', { error });
  } else {
    res.status(error.status).render('error', { error });
  }
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = app;
