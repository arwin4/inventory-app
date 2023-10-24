const express = require('express');

const router = express.Router();

// Require controllers
const typeController = require('../controllers/typeController');

// Render catalog at index
router.get('/', typeController.index);

module.exports = router;
