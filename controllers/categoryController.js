const asyncHandler = require('express-async-handler');

const teaCategory = require('../models/teaCategory');
const tea = require('../models/tea');

// Display list of all tea categories
exports.index = asyncHandler(async (req, res) => {
  const numberOfTeaCategories = await teaCategory.countDocuments().exec();
  const allTeaCategories = await teaCategory.find().exec();
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
  const category = await teaCategory.findById(categoryID).exec();

  // Find all teas of this category
  const teasOfThisCategory = await tea
    .find({ category: { _id: categoryID } })
    .exec();

  res.render('categoryDetail', {
    category,
    teasOfThisCategory,
  });
});
