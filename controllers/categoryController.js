const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const TeaCategory = require('../models/teaCategory');
const tea = require('../models/tea');

// Display list of all tea categories
exports.index = asyncHandler(async (req, res) => {
  const numberOfTeaCategories = await TeaCategory.countDocuments().exec();
  const allTeaCategories = await TeaCategory.find().exec();
  res.render('teaCategoryList', {
    title: 'Tea Categories',
    numberOfTeaCategories,
    allTeaCategories,
  });
});

// Display detail page for specific tea category
exports.categoryDetail = asyncHandler(async (req, res) => {
  const categoryID = req.params.id;

  // Get category info
  const category = await TeaCategory.findById(categoryID).exec();

  // Find all teas of this category
  const teasOfThisCategory = await tea
    .find({ category: { _id: categoryID } })
    .exec();

  res.render('categoryDetail', {
    category,
    teasOfThisCategory,
  });
});

// Display form for new category
exports.newCategory = asyncHandler(async (req, res) => {
  res.render('forms/newCategoryForm', { errors: null });
});

// Handle new category form submission
exports.newCategoryPost = [
  // Validate and sanitize
  body('name', 'Category name must have at least one character')
    .trim()
    .isLength({ min: 1 })
    .unescape(),
  body('description', 'Please fill in a short description')
    .trim()
    .isLength({ min: 1 })
    .unescape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new TeaCategory({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error message(s).
      res.render('forms/newCategoryForm', {
        category,
        errors: errors.array(),
      });
    } else {
      // Data was valid
      const categoryExists = await TeaCategory.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 }) // case insensitive
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display update category form
exports.updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  let category;
  try {
    category = await TeaCategory.findById(categoryId).exec();
  } catch (error) {
    res.status(404).render('errors/404', { notFound: 'Category' });
    return;
  }

  res.render('forms/update-category', { category, errors: null });
});

// Handle update category form submission
exports.updateCategorySubmit = [
  // Validate and sanitize
  body('name', 'Category name must have at least one character')
    .trim()
    .isLength({ min: 1 })
    .unescape(),
  body('description', 'Please fill in a short description')
    .trim()
    .isLength({ min: 1 })
    .unescape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new TeaCategory({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // create new object with old id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error message(s).
      res.render('forms/update-category', {
        category,
        errors: errors.array(),
      });
    } else {
      // Data was valid, so update
      await TeaCategory.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  }),
];

// Handle category deletion
exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await TeaCategory.findById(categoryId).exec();
  if (category === null) {
    res.render('errors/404', { notFound: 'Category' });
  }

  // Find all teas of this category
  const teas = await tea.find({ category: { _id: categoryId } }).exec();

  res.render('delete/delete-category', { category, teas });
});

// Display confirmation of category deletion
exports.categoryDeleted = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  try {
    // Delete this category's teas and the category itself
    await tea.deleteMany({ category: { _id: categoryId } }).exec();
    await TeaCategory.findByIdAndDelete(categoryId).exec();
  } catch (error) {
    res.render('delete/category-deleted', { error });
  }
  // Display confirmation
  const error = null;
  res.render('delete/category-deleted', { error });
});
