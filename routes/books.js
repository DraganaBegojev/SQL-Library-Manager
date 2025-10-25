var express = require('express');
var router = express.Router();
const { Book } = require('../models');

// GET /books - List all books
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll({ order: [['title', 'ASC']] });
    res.render('index', { books }); 
  } catch (error) {
    next(error);
  }
});

// Get /new - Show form to create a new book
router.get('/new', (req, res) => {
  res.render('new-book', { book: {} });
});

// POST /books - Create a new book
router.post('/new', async (req, res, next) => {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      res.render('new-book', { 
        book: Book.build(req.body), 
        errors: error.errors,
        title: 'New Book'
      });
    } else {
      next(error);
    }
  }
});

module.exports = router;
