const express = require('express');

const router = express.Router();

// Require controllers
const typeController = require('../controllers/typeController');
const teaController = require('../controllers/teaController');

// Render catalog at index
router.get('/', typeController.index);

// GET request for one tea type
router.get('/type/:id', typeController.typeDetail);

// GET request for one tea
router.get('/tea/:id', teaController.teaDetail);

module.exports = router;
