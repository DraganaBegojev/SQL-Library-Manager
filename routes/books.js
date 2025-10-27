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

// GET /:id - Show details of a specific book
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { 
        title: 'Update Book',
        book 
      });
    } else {
      const err = new Error('Book Not Found');
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

// POST /:id - Update a specific book
// POST /books/:id - Updates book info in the database
router.post('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      const err = new Error('Book Not Found');
      err.status = 404;
      next(err);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const book = await Book.findByPk(req.params.id);
      res.render('update-book', { 
        book, 
        errors: error.errors, 
        title: 'Update Book' 
      });
    } else {
      next(error);
    }
  }
});


module.exports = router;
