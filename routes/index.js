var express = require('express');
var router = express.Router();

// Redirect home route to /books
router.get ('/', (req, res) => {
  res.redirect('/books');
});

module.exports = router;
