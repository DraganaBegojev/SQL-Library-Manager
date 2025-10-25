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

module.exports = router;
