const express = require('express');

const router = express.Router();

// Redirect index page to catalog
router.get('/', (req, res) => {
  res.redirect('/catalog');
});

module.exports = router;
