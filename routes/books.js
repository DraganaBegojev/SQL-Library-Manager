var express = require('express');
var router = express.Router();
const { Book } = require('../models');
const { Op } = require('sequelize');

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

// POST /:id/delete - Delete a specific book
router.post('/:id/delete', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      const err = new Error('Book Not Found');
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

// pagination

const ITEMS_PER_PAGE = 10;

router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search || ''  ;

  try {
    const { count, rows } = await Book.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { author: { [Op.like]: `%${searchQuery}%` } },
          { genre: { [Op.like]: `%${searchQuery}%` } },
          { year: { [Op.like]: `%${searchQuery}%` } }
        ]
      },
      order: [['title', 'ASC']],
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    res.render('index', { 
      books: rows, 
      currentPage: page, 
      totalPages, 
      searchQuery 
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
