const express = require('express');

const router = express.Router();

// Require controllers
const typeController = require('../controllers/typeController');

// Render catalog at index
router.get('/', typeController.index);

// GET request for one tea type
router.get('/type/:id', typeController.typeDetail);

module.exports = router;
