const express = require('express');

const router = express.Router();

// Require controllers
const categoryController = require('../controllers/categoryController');
const teaController = require('../controllers/teaController');

// Render catalog at index
router.get('/', categoryController.index);

/* CATEGORY */

// GET request for one tea category
router.get('/category/:id', categoryController.categoryDetail);

// GET request for new category
router.get('/new-category', categoryController.newCategory);

// POST request for new category form
router.post('/new-category', categoryController.newCategoryPost);

// GET request for delete category
router.get('/delete-category/:id', categoryController.deleteCategory);

// GET request for updating category
router.get('/update-category/:id', categoryController.updateCategory);

// POST request for updating category
router.post('/update-category/:id', categoryController.updateCategorySubmit);

// GET request for confirmation of category deletion
router.get('/category-deleted/:id', categoryController.categoryDeleted);

/* TEA */

// GET request for one tea
router.get('/tea/:id', teaController.teaDetail);

// GET request for new tea
router.get('/new-tea', teaController.newTea);

// POST request for new tea form
router.post('/new-tea', teaController.newTeaPost);

// GET request for one tea
router.get('/delete-tea/:id', teaController.deleteTea);

module.exports = router;
