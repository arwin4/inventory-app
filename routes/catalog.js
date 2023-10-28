const express = require('express');

const router = express.Router();

// Require controllers
const categoryController = require('../controllers/categoryController');
const teaController = require('../controllers/teaController');

// Render catalog at index
router.get('/', categoryController.index);

// GET request for one tea category
router.get('/category/:id', categoryController.categoryDetail);

// GET request for one tea
router.get('/tea/:id', teaController.teaDetail);

// GET request for new category
router.get('/new-category', categoryController.newCategory);

// POST request for new category form
router.post('/new-category', categoryController.newCategoryPost);

module.exports = router;
