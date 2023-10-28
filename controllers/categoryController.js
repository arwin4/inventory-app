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
  const errors = null;
  res.render('forms/newCategoryForm', { errors });
});

// Handle new category form submission
exports.newCategoryPost = [
  // Validate and sanitize
  body('name', 'Category name must have at least one character')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Please fill in a short description')
    .trim()
    .isLength({ min: 1 })
    .escape(),

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
